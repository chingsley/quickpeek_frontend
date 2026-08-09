import PaystackWebView from '@/components/payment/PaystackWebView';
import {
  initiationErrorMessage,
  makePaymentSheetStyles as styles,
  makePaymentSlideLabel,
  MakePaymentSheetProps,
  PAYMENT_SUCCESS_DISPLAY_MS,
} from '@/components/payment/makePaymentSheet.shared';
import BottomSheet from '@/components/shared/BottomSheet';
import SlideToConfirmButton from '@/components/shared/SlideToConfirmButton';
import { payForRequest, verifyPayment } from '@/services/payments.services';
import { formatMoney } from '@/utils/payment.utils';
import { useStripe } from '@stripe/stripe-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

/**
 * Chat payment flow for the questioner. Stripe: confirms via the native
 * PaymentSheet (saved cards are offered automatically through the customer
 * session). Paystack: hosted checkout in a WebView. Both paths end with a
 * server-side verify — the webhook is the authoritative confirmation.
 */
const MakePaymentSheet = ({
  visible,
  onClose,
  answerRequestId,
  amount,
  currency,
  onPaid,
}: MakePaymentSheetProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [slideResetKey, setSlideResetKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [paystackCheckout, setPaystackCheckout] = useState<{
    url: string;
    transactionId: string;
  } | null>(null);

  useEffect(() => {
    if (visible) {
      setProcessing(false);
      setPaymentSuccess(false);
      setError(null);
      setSlideResetKey((key) => key + 1);
    }
  }, [visible]);

  const resetSlide = useCallback(() => {
    setSlideResetKey((key) => key + 1);
  }, []);

  const finishPayment = useCallback(
    async (transactionId: string) => {
      const confirmed = await verifyPayment(transactionId);
      setProcessing(false);
      setPaymentSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, PAYMENT_SUCCESS_DISPLAY_MS));
      onPaid?.(confirmed);
      onClose();
    },
    [onClose, onPaid],
  );

  const handleConfirm = useCallback(async () => {
    setProcessing(true);
    setError(null);
    try {
      const payResponse = await payForRequest(answerRequestId);

      if (payResponse.stripe) {
        const init = await initPaymentSheet({
          paymentIntentClientSecret: payResponse.stripe.clientSecret,
          customerEphemeralKeySecret: payResponse.stripe.ephemeralKey,
          customerId: payResponse.stripe.customerId,
          merchantDisplayName: 'QuickPeek',
        });
        if (init.error) {
          setError(init.error.message);
          setProcessing(false);
          resetSlide();
          return;
        }

        const present = await presentPaymentSheet();
        if (present.error) {
          // A cancel just returns to the confirm state; anything else shows.
          if (present.error.code !== 'Canceled') {
            setError(present.error.message);
          }
          setProcessing(false);
          resetSlide();
          return;
        }

        await finishPayment(payResponse.transaction.id);
        return;
      }

      if (payResponse.paystack) {
        setPaystackCheckout({
          url: payResponse.paystack.authorizationUrl,
          transactionId: payResponse.transaction.id,
        });
        return;
      }

      setError('Unexpected payment response. Please try again.');
      setProcessing(false);
      resetSlide();
    } catch (err) {
      setError(initiationErrorMessage(err));
      setProcessing(false);
      resetSlide();
    }
  }, [answerRequestId, finishPayment, initPaymentSheet, presentPaymentSheet, resetSlide]);

  const handlePaystackComplete = useCallback(() => {
    const checkout = paystackCheckout!;
    setPaystackCheckout(null);
    setProcessing(true);
    finishPayment(checkout.transactionId).catch(() => {
      setPaymentSuccess(false);
      setProcessing(false);
      resetSlide();
      setError('Could not confirm the payment yet. Check your wallet shortly.');
    });
  }, [finishPayment, paystackCheckout, resetSlide]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={styles.title}>Make payment</Text>
        <Text style={styles.subtitle}>
          Pay the responder for this question. The payment transfers to them as soon as it
          succeeds.
        </Text>
        <Text style={styles.amount}>{formatMoney(amount, currency)}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <SlideToConfirmButton
          label={makePaymentSlideLabel(amount, currency)}
          onConfirm={handleConfirm}
          loading={processing}
          success={paymentSuccess}
          resetKey={slideResetKey}
        />
      </View>

      {paystackCheckout ? (
        <PaystackWebView
          authorizationUrl={paystackCheckout.url}
          onComplete={handlePaystackComplete}
          onCancel={() => {
            setPaystackCheckout(null);
            setProcessing(false);
            resetSlide();
          }}
        />
      ) : null}
    </BottomSheet>
  );
};

export default MakePaymentSheet;
