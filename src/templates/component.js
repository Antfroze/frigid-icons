export default (svgContents, filled) => {
  return filled
    ? `<script>
  export let size = 24;
  export let color = "currentColor";
</script>

${svgContents}`
    : `<script>
  export let size = 24;
  export let color = "currentColor";
  export let strokeWidth = "1.5";
  export let strokeLinecap= "round";
  export let strokeLinejoin= "round";
</script>

${svgContents}
`;
};
