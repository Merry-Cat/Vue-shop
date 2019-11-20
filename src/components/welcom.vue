<template>
  <div class="welcom">
    <span>{{showcare}},{{username}}</span><span>,欢迎您的到来。</span>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        username:window.sessionStorage.getItem("username"),
        care:['早上好','下午好','晚上好','夜深了，注意休息'],
        showcare:''
      }
    },
    created(){
      this.careSentens();
    },
    methods:{
      careSentens(){
        let time = new Date().getHours()
        switch (true){
          case time>6&&time<=12:
          this.showcare = this.care[0]
            break;
          case time>12&&time<=18:
          this.showcare = this.care[1]
            break
          case time>18&&time<24:
          this.showcare = this.care[2]
            break
          case time>=0&&time<=6:
          this.showcare = this.care[3]
            break;
            default:
            console.log("未知时间你敢信？")
            break;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
