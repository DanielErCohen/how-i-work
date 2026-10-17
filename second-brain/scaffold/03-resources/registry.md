# Registry

The one place for the spelling of names that dictation and voice notes get wrong: people, places,
pets, businesses. Claude checks dictated text against this file before it files anything.

One row per name. Add a row the first time you notice a transcription error, and add the wrong
spellings you have seen, so the next fix is a lookup.

| Name | Kind | Notes | Heard as |
|------|------|-------|----------|
| Sam Raven | person | friend, `<how you know them>` | Sam Raiven, Sam Rayven |
| Robin Hale | person | friend | Robyn, Robin Hail |
| Lakeside Park | place | the park by the river | Lake Side Park, Lakesight Park |
| Mill Street Bakery | place | Saturday bread | Milestreet Bakery, Mill Street Bakeries |

The rows above are invented. Replace them with your own.

## Rules

- A name in the registry is spelled as written here, whatever the dictation says.
- A name that is not in the registry is left as dictated and flagged. You decide whether it earns
  a row.
- Dates and numbers in dictated text are checked against the surrounding context, since a dictation
  tool often hears "the 15th" as "the 50th".
- Do not store contact details here. A registry holds spellings only.
