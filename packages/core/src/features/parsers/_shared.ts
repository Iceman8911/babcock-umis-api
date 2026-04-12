export const _SAMPLE_HTML_RESPONSE: Response = new Response(`<html lang="en">
  <head>
    <title>Example Domain</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="chrome-extension://cmndjbecilbocjfkibfbifhngkdmjgog/core/scripts/inpage/sdk.script.js"></script>
    <script src="chrome-extension://ecabpflfbpjfmccflbcjooejhiclhice/spoof-slow-network.js"></script>
  </head>
  <body>
    <div>
      <h1>Example Domain</h1>
      <p>This domain is for use in documentation examples without needing permission. Avoid use in operations.</p>
      <p><a href="https://iana.org/domains/example">Learn more</a></p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
      <form>
        <label for="input1">Input:</label>
        <input id="input1" type="text" placeholder="Type something..." />
        <button type="submit">Submit</button>
      </form>
      <img src="https://via.placeholder.com/150" alt="Placeholder Image" />

      <div id="foo">
        Top-Level
        <div id="bar">
          <p>Nested</p>
        </div>
        <button>
          <div>Another Nested</div>
        </button>
      </div>
    </div>
  </body>
</html>
`);
