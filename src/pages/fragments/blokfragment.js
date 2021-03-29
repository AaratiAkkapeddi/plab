import { gql } from '@apollo/client';

export const CORE_BLOKK_FIELDS = gql`
  fragment CoreBlokkFields on Blokk {
    id
    content(format: HTML, no_links: true)
    file_url
    image_url
    embed_html
    href
  }
`;