<template>
	<div id="app" class="notfoundbg">
		<main>
          
			<section class="center">
				<div>
					 <el-button type="primary" round class="commonbutton">返回首页</el-button>
				</div>
			</section>
		</main>
	</div>
</template>
<style lang="scss">
	//scoped 表示唯一
	@import "@/assets/Scss/main.scss";
</style>
<script>
import Header from '@/components/publicTemplate/Header'

	export default {
		data() {
			return {			
				value: ''
			}
    },
    components:{ Header }
	}
</script>