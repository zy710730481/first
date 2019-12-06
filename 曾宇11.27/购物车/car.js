
//1.初始化商品列表
//2.点击加入购物车商品加入购物车
//3.新商品信息保存到本地储存
//4.渲染购物车列表
//5.购物车的删改

//函数的自执行，避免变量的污染
(function(){
    var products=[
        {
            name:"洗发水",
			pic:"购物车/img/xifashui.jpg",
			price:10,
			id:23435435
        },
		{
			name:"毛巾",
			pic:"购物车/img/maojin.jpg",
			price:14,
			id:768678768
		},
		{
			name:"洗手液",
			pic:"购物车/img/xishouye.jpg",
			price:23,
			id:123123
		}
    ]


    class ShoppingCart{
        constructor(containerId,products){
            this.container=document.getElementById(containerId);//购物车和商品列表所在的容器
            this.shopList=document.createElement('table');//商品列表
            this.cartList=document.createElement('table');//购物车列表
            this.products=products;//商品
            this.container.appendChild(this.shopList);
            this.container.appendChild(this.cartList);
            this.cartProducts=this.getStorage()||[];//购物车里的商品集合

        }

        init(){
            this.initShopList();
            if(this.getStorage().length>0){
                //如果本地存储有数据，刚开始渲染页面就渲染购物车
                this.renderCartList();
            }
        }
        //初始化商品列表方法
        initShopList(){
            var str = `<thead>
            <tr>
                <th>商品ID</th>
                <th>商品名称</th>
                <th>商品图片</th>
                <th>商品价格</th>
                <th>操作</th>
            </tr>
          </thead>`;

          str+="<tbody>";
            this.products.forEach((value)=>{
                str+=`<tr>
                    <td>${value.id}</td>
                    <td>${value.name}</td>
                    <td><img src="${value.pic}" /></td>
                    <td>${value.price}</td>
                    <td>
                        <a href="javascript:;" class="addCart">加入购物车</a>
                    </td>
                </tr>`
            });
            str+="</tbody>";
            this.shopList.innerHTML=str;
            this.addCartListEvent();
        }

        //添加加入购物车事件
        addCartListEvent(){
            var _this=this;//_this指的是实例对象
            //获取所有的加入购物车按钮
            var addCarBtnArr=this.container.querySelectorAll('.addCart');//
            addCarBtnArr.forEach((addCarBtn)=>{
                addCarBtn.onclick=function(){
                    var tr =this.parentNode.parentNode;//当前被点击的a的所在行
                    console.log(tr);
                    var currentProduct={
                        name:tr.children[1].innerHTML,
                        price:tr.children[3].innerHTML,
                        pic:tr.children[2].children[0].src,
                        id:tr.children[0].innerHTML,
                    }
                    _this.addToCartProducts(currentProduct);
                   console.log(currentProduct);
                   _this.renderCartList();
                    
                }
            })
        }

        //该方法负责接收一个新商品信息，然后把这个商品信息加入到本地存储中
        addToCartProducts(currentProduct){
            
            for(var i=0;i<this.cartProducts.length;i++){
                //如果传入的这个新商品在购物车列表中有重复，就直接把购物车列表中这个重复的商品数量加1
                if(this.cartProducts[i].id==currentProduct.id){
                    this.cartProducts[i].num++;
                    this.setStorage(this.cartProducts);
                    return;//加完重复的商品就可以退出循环
                }
            }
            //如果你传入这个新商品在购物车列表中没有重复，就直接添加到购物车列表中，数量为1
            currentProduct.num=1;
            this.cartProducts.push(currentProduct);//将新商品添加到商品数组当中去
            this.setStorage(this.cartProducts);//将更新后的数组写入本地存储空间
        }

        //该方法负责渲染购物车列表
        renderCartList(){
            var str= `<thead>
                     <tr>
                        <th>商品ID</th>
                        <th>商品名称</th>
                        <th>商品图片</th>
                        <th>商品价格</th>
                        <th>商品数量</th>
                        <th>操作</th>
                    </tr>
            </thead>`;

            str+="<tbody>";
            //获取本地存储空间中的商品数组遍历
            this.getStorage().forEach((product)=>{
                str+=`<tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><img src="${product.pic}"/></td>
                    <td>${product.price}</td>
                    <td class="change">
                    <span class="jian">-</span>
                    ${product.num}
                    <span class="jia">+</span>
                    </td>
                    <td>
                        <a href="javascript:;" class="del">删除</a>
                    </td>
                </tr>`
            })

            str+="</tbody>";
            this.cartList.innerHTML=str;
            if(this.getStorage().length<1){
                this.cartList.innerHTML="";
            }
            this.deleteProductEvent();
            this.changeNumEvent();
        }

        //添加删除商品事件
        deleteProductEvent(){
            var _this=this;
            //获取所有的删除按钮
            var delBtnArr=this.container.querySelectorAll('.del');
            delBtnArr.forEach((delBtn)=>{
                delBtn.onclick=function(){
                    //在事件函数中，this指的是事件源：删除按钮a标签
                    var id=this.parentNode.parentNode.children[0].innerHTML;
                    _this.deleteFromCartProducts(id);
                    _this.renderCartList();
                }
            })
        }

        //从购物车列表中删除商品的方法
        deleteFromCartProducts(id){
            var _this=this;
            this.cartProducts=this.getStorage();
            this.cartProducts=this.cartProducts.filter((product)=>{
                if(product.id==id){
                    return false;
                }else{
                    return true;
                }
            });
            this.setStorage(this.cartProducts);
            // if(this.getStorage().length<1){
            //     this.cartList.innerHTML="11111"
            //     console.log(this.cartList.innerHTML)
            // }
        }



        该方法用于修改商品数量
        changeNumEvent(){
            //事件委托
            var _this=this
            var changeNumTdArr=this.container.querySelectorAll('.change');
            changeNumTdArr.forEach((changNumTd)=>{
                changNumTd.onclick=function(e){
                    var target=e.target;
                    var id=this.parentNode.children[0].innerHTML;//被点击的商品的id
                    if(e.target.className=="jian"){
                        _this.jianNum(id);
                        _this.renderCartList();
                    }
                    if(e.target.className=="jia"){
                        _this.jiaNum(id);
                        _this.renderCartList();
                    }
                }
            })
        }

        //减数量
        jianNum(id){
            var arr = this.getStorage();
            for(var i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    arr[i].num--;
                    if(arr[i].num<=0){
                        this.deleteFromCartProducts(id);
                        this.renderCartList();
                    }
                    this.setStorage(arr);
                    return;
                }
            }
        }

        //加数量
        jiaNum(id){
            var arr =this.getStorage();
            for(var i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    arr[i].num++;
                    this.setStorage(arr);
                }
            }
        }

        // 设置localStorage
        setStorage(json){
            localStorage.setItem('cart',JSON.stringify(json));
        }

        // 获取localStorage
        getStorage(){
            return JSON.parse(localStorage.getItem('cart'))||[];
            //如果没有，返回一个空数组
        }
    }

    new ShoppingCart("container",products).init();

})();