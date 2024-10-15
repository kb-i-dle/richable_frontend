<template>
  <div class="pageWrapper">
    <SelectMonth />
    <ConsumeCategorySum />
    <ConsumeCompareMonth />
  </div>
</template>
<script setup>
import SelectMonth from '@/components/consume/SelectMonth.vue'
import ConsumeCategorySum from '@/components/consume/ConsumeCategorySum.vue'
import ConsumeCompareMonth from '@/components/consume/ConsumeCompareMonth.vue'
</script>

<style scoped>
.pageWrapper {
  margin: 80px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
}
/* 웹용*/
@media (min-width: 1024px) {
  .pageWrapper {
    margin: 80px;
    width: 100%;
  }
}

/* 태블릿 */
@media (min-width: 768px) and (max-width: 1023px) {
  .pageWrapper {
    margin: 40px;
    width: 100%;
  }
}

/* 모바일 */
@media (max-width: 767px) {
  .pageWrapper {
    margin: 20px;
    width: 100%;
  }
}

</style>
