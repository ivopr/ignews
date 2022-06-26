import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { signIn, signOut, useSession } from "next-auth/react"

import styles from "./styles.module.scss"
import Image from "next/image"

export function SignInButton() {
  const { data: session } = useSession()

  return session ? (
    <button
      className={styles.signInButton}
      onClick={() => signOut()}
      type="button"
    >
      <Image src={session.user.image} alt={session.user.name} />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      onClick={() => signIn("github")}
      className={styles.signInButton}
      type="button"
    >
      <FaGithub color="#EBA417" />
      Sign in with GitHub
    </button>
  )
}