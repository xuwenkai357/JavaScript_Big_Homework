var app = new Vue({
  el:"#app",
//   ready:function(){
//     this.$http.get('  http://192.168.1.105:8080/book.json',function(data){
//       this.$set('books',data);
//     }).error(function(data,status,request){
//       console.log('fail' + status + ',' + request )
//     })
//   },
  data:{
    sortparam:'',
    book:{
      id:0,
      author:'',
      name:'',
      price:''
    },
//     books:''
    books: [{
                id: 1,
                author: '曹雪芹',
                name: '红楼梦',
                price: 32.0
            }, {
                id: 2,
                author: '施耐庵',
                name: '水浒传',
                price: 30.0
            }, {
                id: '3',
                author: '罗贯中',
                name: '三国演义',
                price: 24.0
            }, {
                id: 4,
                author: '吴承恩',
                name: '西游记',
                price: 20.0
            }]
  },
  computed:{
    sum:function(){
      var result = 0;
      for (var i=0;i<this.books.length;i++){
        result += Number(this.books[i].price)
      };
      return result;
    }
  },
  methods:{
    addBook:function(){
      this.book.id = this.books.length +1;
      this.books.push(this.book);
      this.book = '';
    },
    delBook:function(book){
      this.books.$remove(book);
    },
    sortBy:function(sortparam){
      this.sortparam = sortparam
    }
  }
})
