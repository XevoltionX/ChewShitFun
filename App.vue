<script>
	import { usePoopStore } from '@/stores/poop.js'
	import { loadTheme } from '@/utils/theme.js'

	let launched = false

	export default {
		setup() {
			const poopStore = usePoopStore()
			return { poopStore }
		},
		onLaunch: function() {
			console.log('App Launch')
			this.poopStore.loadFromStorage()
			loadTheme()
			uni.hideTabBar()
		},
		onShow: function() {
			console.log('App Show')
			if (launched) {
				uni.reLaunch({ url: '/pages/login/index' })
			}
			launched = true
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page, view, text, button, input {
		font-family: "PingFang SC", "Noto Sans SC", "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif;
	}
</style>
