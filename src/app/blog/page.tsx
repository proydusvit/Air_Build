import { performRequest } from '../../../lib/datocms';

import { format } from 'date-fns';
import { responsiveImageFragment } from "../../../lib/fragments";
import "./main.css"
import Image from 'next/image';
import Link from 'next/link';

const PAGE_CONTENT_QUERY = `
  
 query MyBlog{
  allPosts {
    _createdAt
    author {
      author
      id
      picture {
        url
      }
    }
    title
    coverImage {
      url
    }
    content {
      value
      blocks {
        __typename
        ... on ImageBlockRecord {
          id
         image {
         responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
                ...responsiveImageFragment
              }
        }
        }
      }
      
    }
    slug
  }
  }
   ${responsiveImageFragment}

`;

export default async function Home() {

  const data = await performRequest({
    query: PAGE_CONTENT_QUERY,
    variables: { limit: 10 },
    revalidate: 60
  });




  return (
    <main className="container flex min-h-screen flex-col items-center justify-between p-24">
      <ul className="mb-2 gap-12">
        {data.allPosts && data.allPosts.map((article: any) => (
          <li key={article._createdAt}>
            <Link href={`blog/${article.slug}`}>
              <h2>{article.title} </h2>
              {article.coverImage && <Image src={article.coverImage.url} alt='Cover Image' width={300} height={150} />}
              <p>{format(new Date(article._createdAt), 'MMMM dd, yyyy')}</p>
              <p>{article.author.author}</p>
              {article.author.picture && <Image src={article.author.picture.url} alt='Author Picture' width={100} height={50} />}

            </Link>

          </li>
        ))}

      </ul>

    </main>

  );


}


