/* eslint-disable @next/next/no-img-element */
import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { signIn, signOut, useSession } from "next-auth/react"

import styles from "./styles.module.scss"

export function SignInButton() {
  const { data } = useSession();

  return data ? (
    <button
      className={styles.signInButton}
      onClick={() => signOut()}
      type="button"
    >
      <img src={data.user.image} alt={data.user.name} />
      {data.user.name}
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