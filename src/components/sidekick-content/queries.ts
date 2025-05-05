export const GET_CAPTIONS = `
subscription getCaptions($locale: String!) {
  caption_persistent(
    where: { locale: { _eq: $locale } }
    order_by: { createdAt: asc }
  ) {
    user {
      avatar
      color
      name
    }
    captionText
    captionId
    createdAt
  }
}
`;
