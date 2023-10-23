import { Inject, Controller, Get, Query, Body, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { RepostOptions } from '../interface';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
  @Post('/report')
  async reposrtInfo(@Body() info: RepostOptions) {
    console.log('上报信息', info);
    return {};
  }

  @Get('/dashboard')
  async getDashboard(@Query('uid') uid) {
    this.ctx.set('c-id', uid);
    this.ctx.cookies.set('cid', uid, {
      httpOnly: false,
      signed: false,
    });
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div>hello world</div>

    <script>
      let enterTime, leaveTime;
      window.addEventListener("load", () => {
        console.log("页面加载了");
        enterTime = new Date().getTime();
      });
      window.addEventListener("visibilitychange", () => {
        console.log("页面显隐");
        leaveTime = new Date().getTime();
        let lastTime = leaveTime - enterTime;
        let cid = getCookie("cid");
        reportReq(lastTime, cid);
      });

      const reportReq = (lastTime, cid) => {
        const result = fetch("http://127.0.0.1:7001/api/report", {
          method: "post",
          body: JSON.stringify({
            lastTime: lastTime,
            cid: cid,
          }),
          headers: {
            accept: "*/*",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "none",
            "content-type": "application/json; charset=UTF-8",
          },
        }).then((res) => {
          console.log(res);
        });
      };

      const getCookie = (cookieName) => {
        const cookieList = document.cookie.split(";");
        for (let i = 0; i < cookieList.length; i++) {
          const arr = cookieList[i].split("=");
          if (cookieName === arr[0].trim()) {
            return arr[i];
          }
        }
        return "";
      };
    </script>
  </body>
</html>

    `;
  }
}
