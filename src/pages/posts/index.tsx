import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import * as Prismic from "@prismicio/client"
import * as RichText from "@prismicio/helpers"

import { getPrismicClient } from "../../services/prismic"
import styles from "./styles.module.scss"

interface Post {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts?.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ], {
    fetch: ["posts.title", "posts.content"],
    pageSize: 20,
  })

  const posts = response?.results.map(post => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt: post.data.content.find(content => content.type === "paragraph")?.text ?? '',
    updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }))

  return {
    props: {
      posts
    },
    revalidate: 60 * 60
  }
}