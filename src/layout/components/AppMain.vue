<template>
  <section class="app-main" style="min-height: 100%; padding:1.5em;">
    <transition name="fade" mode="out-in">
      <!--<keep-alive :include="cachedViews">-->
      <router-view></router-view>
      <!--</keep-alive>-->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>
