# PM digest

Get your PM newsletters as one 4-minute digest, twice a week.

<details>
<summary><b>Why I built it:</b> I subscribed to 12 product newsletters and rarely read them, so a routine now reads them for me.</summary>

- The digest arrives Monday and Thursday morning: 4 headlines, one product-sense drill from a 24-topic curriculum and one thing to use this week.
- A cap on each section keeps a read to about 4 minutes.
- The routine stores its state in the sent email's footer, so it needs no database.

</details>

It is a cloud routine that reads a curated set of product newsletters from my inbox and sends one short digest: 4 headlines, one product-sense drill, product news, tech, AI in PM and a line on how to use it this week.

## How it works

- **Schedule:** Monday and Thursday morning, as a Claude Code cloud routine with the Gmail connector and WebFetch. The prompt is in [`routine-prompt.md`](routine-prompt.md).
- **State lives in email.** The newest digest with "v3" in its footer sets the window. Each footer records the drill number and topic, so the routine knows which topics it has covered.
- **Sources** come from one Gmail query plus a label you apply. After each run the routine marks the source newsletters read and archives them. It never trashes anything.
- **The drill** comes from a 24-topic curriculum (problem framing, discovery, strategy cascade, metrics, prioritisation, experiment design, evals for AI products, pricing, positioning, retention and more). It picks the lowest-numbered topic not yet drilled. Each drill has a scenario, a model answer of at most 5 bullets, and the common mistake.
- **Scenarios use generic companies** (a marketplace, a streaming service, a bank). The reader's own products stay out.

## Sources

| Source | Focus |
|---|---|
| Lenny's Newsletter, How I AI, The Skip | Product craft, growth, AI workflows |
| Product Growth, AI by Aakash | PM craft, AI PM, careers |
| Product Compass (Paweł Huryn) | AI product management, frameworks |
| GenAI PM Daily | Daily AI news ranked for PMs |
| Behind the Craft (Peter Yang) | AI tools, tutorials, essays |
| Charlie Hills | AI content and LinkedIn tactics |
| Product Institute (Melissa Perri) | Product strategy, operations, outcomes |
| cxo.dev | Tech leadership |
| Tech Brew (Morning Brew) | General tech news |
| Product Talk (Teresa Torres) | Continuous discovery |
| SVPG (Marty Cagan) | Product operating model, empowered teams |
| The Beautiful Mess (John Cutler) | Product operations, org design |

Replace this list with newsletters you read. Add each sender's full address to the Gmail query in the prompt. Gmail filters and `from:` searches in the routine only match full addresses.

## Setup

1. Subscribe to the newsletters. Create a Gmail label and a filter that applies it to your newsletters.
2. Copy `routine-prompt.md` and replace each placeholder in angle brackets: your address, your label, your timezone and target hour.
3. Create a scheduled routine in Claude Code with the Gmail connector and WebFetch enabled, and paste the prompt. Schedule it two slots one hour apart in UTC if your timezone has daylight saving, as the time gate in the prompt expects.
4. Run it once by hand and read the result. When the output is wrong, fix the prompt.

## Why it works this way

- State in the sent mail means the routine needs no database, and a failed run leaves nothing half-written.
- Hard caps on each section keep the digest short. The reader's attention is the scarce part.
- Newsletter text is data. The prompt says never to follow instructions found inside it.
