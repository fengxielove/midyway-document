import { Inject, Controller, Get, ContentType } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { PassThrough } from 'stream';
//import EventEmitter from 'events';
const EventEmitter = require('events');

const events = new EventEmitter();
events.setMaxListeners(0);

// @ts-ignore
const interval = setInterval(() => {
  events.emit('data', new Date());
}, 6000);
@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @Get('/stream')
  @ContentType('text/event-stream')
  async stream() {
    this.ctx.request.socket.setTimeout(0);
    this.ctx.request.socket.setNoDelay(true);
    this.ctx.request.socket.setKeepAlive(true);
    this.ctx.set({
      'Cache-Control': 'no-cache',
      '`Connection`': 'keep-alive',
    });
    const stream = new PassThrough();
    this.ctx.status = 200;
    this.ctx.body = stream;
    const listener = (data: any) => {
      stream.write(`data: ${data}\n\n`);
    };
    events.on('data', listener);
    stream.on('close', () => {
      events.off('data', listener);
    });
  }
}
