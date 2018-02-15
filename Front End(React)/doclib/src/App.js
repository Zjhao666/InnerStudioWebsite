import React, { Component } from 'react';

import OSUI from './Coms/OSUI'

let osui=new OSUI();
console.log(osui.newWindow());
export default osui.newWindow('Hello world');
