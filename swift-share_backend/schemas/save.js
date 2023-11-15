export default {
  name: 'save',
  title: 'Save',
  type: 'document',
  fields: [
    // thong tin nguoi luu pin
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'postedBy',
    },
    // thong tin nguoi luu pin (duplicate)
    {
      name: 'userId',
      title: 'UserId',
      type: 'string',
    },
  ],
}
