<script lang="ts">
  export var a = 0;
  export var b = 0;

  $: c = a + b;
</script>

<h1>
  This is a dummy component, we use this so we can switch and demonstrate
  parameters
</h1>
<code>
  <pre>{a}+{b}={c}</pre>
</code>

<style>
  code {
    font-size: 16pt;
  }
</style>
