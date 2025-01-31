<template>
  <footer>
    <div class="fixed bottom-2 left-0 w-full mx-auto flex items-center justify-center text-center gap-2 text-sm">
      <span>Powered by</span>

      <a
        href="https://microsoft.com"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold text-blue-400 hover:text-blue-500 transition-colors"
      >
        Microsoft
      </a>
      <span class="flex items-center gap-1"
        >ResNet-50 <Icon name="ant-design:trademark-outlined" size="15"
      /></span>
    </div>
  </footer>
</template>

<style>
footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 8px;
}
</style>
