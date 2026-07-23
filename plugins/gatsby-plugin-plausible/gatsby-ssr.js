export const onRenderBody = (
  { setHeadComponents },
  { dataDomain, apiEndpoint, scriptSrc }
) => {
  setHeadComponents([
    <script
      key="plausible"
      async
      data-domain={dataDomain}
      data-api={apiEndpoint}
      src={scriptSrc}
    />,
    <script
      key="plausible-init"
      id="plausible-init"
      dangerouslySetInnerHTML={{
        __html: `
window.plausible = window.plausible || function() {
    (plausible.q = plausible.q || []).push(arguments)
}, plausible.init = plausible.init || function(i) {
    plausible.o = i || {}
};
plausible.init({
    endpoint: "${apiEndpoint}",
})
      `
      }}
    />
  ])
}
