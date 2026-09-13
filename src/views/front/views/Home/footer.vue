<template>
    <div class="footer">
        <div class="bottom_ba">
<!--            <div class="f-li">-->
<!--                <div class="f-ld">-->
<!--                    <ul>-->
<!--                        <li>关于我们</li>-->
<!--                        <li>联系我们</li>-->
<!--                        <li>加入我们</li>-->
<!--                        <li>商务合作</li>-->
<!--                        <li>常见问题</li>-->
<!--                        <li>友情链接</li>-->
<!--                    </ul>-->
<!--                </div>-->
<!--            </div>-->
            <div class="f-main">
              <a href="http://www.cdeaa.com/">成都市房地产经纪协会</a>
              <a href="https://www.cdzjryb.com/">成都住建蓉e办</a>
              <a href="https://www.funi.com/">成都房联</a>
            </div>

            <div class="n-footer-copyright clearfix">
                <div class="n-footercopy">
                    <div class="n-footercopy-text">
                        <span>成都市青羊区清百路107号8幢1层111号&nbsp; &nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;待定 |
                            &nbsp;&nbsp;&nbsp;<a class="item-a" target="_blank"
                                href="/resources/static/prove.html">营业执照</a></span>
                        <span style="margin-top: 12px;">Copyright © 2019 四川文方天府网科技有限公司 &nbsp;&nbsp;&nbsp;|
                            &nbsp;&nbsp;&nbsp;<a class="item-a"
                                href="https://beian.miit.gov.cn/icp/publish/query/icpMemoInfo_showPage.action#/Integrated/recordQuery">
                                蜀ICP备20017276号
                            </a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;

                            <img src="@/assets/image/beian.png" class="pliceIcon">
                            <a class="item-a"
                                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51010502010935">
                                川公网安备 51010502010935号
                            </a>
                        </span>
                        <span>
                            违法和不良信息举报电话:400-816-2019&nbsp; &nbsp;&nbsp;
                            | &nbsp;&nbsp;&nbsp;
                            举报邮箱：待定
                            &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
                            <a class="report" style="color: rgba(121,121,121,1)" target="blank"
                                href="https://www.12377.cn/">网上有害信息举报</a>
                        </span>
                    </div>
                </div>
                <div style="position: absolute;margin-left: 60%;">
                  <img style="width: 70px;border-radius: 50%;" src="../../../../assets/image/logoer.jpg" alt="">
                  <p style="color: #b4bccc;margin-top: 1px;">微信小程序</p>
                </div>
                <div class="n-footerphone">
                    <h3>客服热线</h3>
                    <b> 400-816-2019</b>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
dd,
dl,
dt,
li,
ol,
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.footer {
    margin-top: 50px;
    width: 100%;
    background: url("../../../../assets/image/index_footer_bg.png");
}

.bottom_ba {
    margin: auto;
    width: 1160px;
}

.n-footer-copyright {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 20px;
    padding: 30px 0;
}

.n-footercopy-text {
    float: left;
    margin-left: 19px;
}

.n-footercopy-text span {
    font-size: 12px;
    font-weight: 300;
    color: rgba(121, 121, 121, 1);
    display: block;
}

.item-a {
    color: #969696;
}

.pliceIcon {
    width: 20px;
    height: 20px;
}

.n-footerphone {
    float: right;
    color: white;
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}


.f-li {
    height: 60px;
    text-align: center;
}

.f-ld {
    margin: 0 auto;
    width: 1200px;
    height: 60px;
}

.f-ld>ul {
    display: inline-block;
    height: 60px;
    font-size: 14px;
    color: white;

}

.f-ld>ul>li {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    width: 100px;
    margin: auto 40px;
}

.f-main {
    height: 50px;
    color: #b4bccc;
    display: flex;
    justify-content: space-evenly;
  align-items: center;
}

.f-lt {
    margin: 0 auto;
    width: 1200px;
    height: 199px;
}

.f-left {
    height: 199px;
    width: 300px;
    background-color: d7ece2;
    text-align: left;
    position: relative;
    float: left;
}

.f-left>h2 {
    position: absolute;
    top: 10px;
    left: 20px;
    color: white;
}

.f-left>ul {
    margin: 10px 10px;
    position: absolute;
    top: 10px;
    color: white;
}

.f-left>ul>li {
    margin: 10px 10px;
}

.f-center {
    height: 199px;
    width: 500px;
    background-color: d7ece2;
    text-align: center;
    float: left;

}

.f-center>:nth-child(1) {
    float: left;
    margin-left: 40px;
    margin-top: 30px;
    color: white;
    text-align: left;

}

.f-right {
    height: 199px;
    width: 400px;
    float: right;
    background-color: d7ece2;
    position: relative
}

.f-right>img {
    width: 125px;
    height: 125px;
    position: absolute;
    left: 130px;
    top: 36px;

}

.f-right>p {
    position: absolute;
    bottom: 20px;
    left: 155px;
    color: white;
}
</style>
