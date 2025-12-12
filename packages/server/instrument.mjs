import * as Sentry from "@sentry/node"

Sentry.init({
    dsn: "https://0a41e1a9932b6ea3e7470635d0137cf5@o4510522032586752.ingest.de.sentry.io/4510522034094160",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});