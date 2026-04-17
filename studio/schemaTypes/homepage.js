export default {
  name: 'homepage',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Main Title',
      type: 'string',
    },
    {
      name: 'heroBadge',
      title: 'Hero Red Badge Text',
      type: 'string',
    },
    {
      name: 'heroSideText',
      title: 'Hero Vertical Side Text',
      type: 'string',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
    },
    {
      name: 'clientsStat',
      title: 'Client Avatar Stat Number (e.g. 500+)',
      type: 'string',
    },
    {
      name: 'clientsText',
      title: 'Client Avatar Subtext',
      type: 'string',
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube Embed URL',
      type: 'url',
    },
    {
      name: 'quoteStats',
      title: 'Quote Form Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Number' },
            { name: 'label', type: 'string', title: 'Label' }
          ]
        }
      ]
    },
    {
      name: 'highlights',
      title: 'Highlight Blocks (Our Approach)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Small Label' },
            { name: 'title', type: 'string', title: 'Main Title' },
            { name: 'description', type: 'text', title: 'Description Text' },
            { name: 'image', type: 'image', title: 'Featured Image', options: { hotspot: true } }
          ]
        }
      ]
    }
  ]
}
