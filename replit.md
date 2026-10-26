# Danat Swap Demo

## Run on Replit

Use the **Run** button to start the `Start application` workflow.
It serves the existing static site on `0.0.0.0:5000` using:

```sh
python3 -m http.server 5000 --bind 0.0.0.0
```

Open the web preview to view the demo. There are no application dependencies,
build steps, secrets, or external services required.

## Project scope

The imported HTML, CSS, and JavaScript are preserved. This is an Arabic/English
visual prototype only: wallet connections, price quotes, and real trades are
not enabled. The bundled service worker caches the site for offline use; if
changes appear stale, clear this site's browser storage and reload.

Python's built-in server is for development preview, not a production backend.
