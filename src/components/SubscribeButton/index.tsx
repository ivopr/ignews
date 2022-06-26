import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { api } from "../../services/api"
import { getStripeJs } from "../../services/stripejs"

import styles from "./styles.module.scss"

interface SubscribeButtonProps {}

export function SubscribeButton({}: SubscribeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn("github")
      return
    }

    if (session?.activeSubscription) {
      router.push("/posts")
      return
    }

    try {
      const response = await api.post("/subscribe")
      const { sessionId } = response.data
      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <button
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      type="button"
    >
      Subscribe Now
    </button>
  )
}