(this.webpackJsonpdeliberatively=this.webpackJsonpdeliberatively||[]).push([[5],{576:function(e,t,n){"use strict";var r=n(16),i=n(8),a=n(3),c=n(1),o=(n(22),n(13)),s=n(42),d=n(547),p=n(511),u=n(12),l=n(20);var f=c.createContext(),g=n(31),m=n(312),h=n(512);function v(e){return Object(m.a)("MuiGrid",e)}var b=["auto",!0,1,2,3,4,5,6,7,8,9,10,11,12],x=Object(h.a)("MuiGrid",["root","container","item","zeroMinWidth"].concat(Object(g.a)([0,1,2,3,4,5,6,7,8,9,10].map((function(e){return"spacing-xs-".concat(e)}))),Object(g.a)(["column-reverse","column","row-reverse","row"].map((function(e){return"direction-xs-".concat(e)}))),Object(g.a)(["nowrap","wrap-reverse","wrap"].map((function(e){return"wrap-xs-".concat(e)}))),Object(g.a)(b.map((function(e){return"grid-xs-".concat(e)}))),Object(g.a)(b.map((function(e){return"grid-sm-".concat(e)}))),Object(g.a)(b.map((function(e){return"grid-md-".concat(e)}))),Object(g.a)(b.map((function(e){return"grid-lg-".concat(e)}))),Object(g.a)(b.map((function(e){return"grid-xl-".concat(e)}))))),j=n(4),w=["className","columns","columnSpacing","component","container","direction","item","lg","md","rowSpacing","sm","spacing","wrap","xl","xs","zeroMinWidth"];function O(e){var t=parseFloat(e);return"".concat(t).concat(String(e).replace(String(t),"")||"px")}var S=Object(u.a)("div",{name:"MuiGrid",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState,r=n.container,i=n.direction,a=n.item,c=n.lg,o=n.md,s=n.sm,d=n.spacing,p=n.wrap,u=n.xl,l=n.xs,f=n.zeroMinWidth;return[t.root,r&&t.container,a&&t.item,f&&t.zeroMinWidth,r&&0!==d&&t["spacing-xs-".concat(String(d))],"row"!==i&&t["direction-xs-".concat(String(i))],"wrap"!==p&&t["wrap-xs-".concat(String(p))],!1!==l&&t["grid-xs-".concat(String(l))],!1!==s&&t["grid-sm-".concat(String(s))],!1!==o&&t["grid-md-".concat(String(o))],!1!==c&&t["grid-lg-".concat(String(c))],!1!==u&&t["grid-xl-".concat(String(u))]]}})((function(e){var t=e.ownerState;return Object(a.a)({boxSizing:"border-box"},t.container&&{display:"flex",flexWrap:"wrap",width:"100%"},t.item&&{margin:0},t.zeroMinWidth&&{minWidth:0},"nowrap"===t.wrap&&{flexWrap:"nowrap"},"reverse"===t.wrap&&{flexWrap:"wrap-reverse"})}),(function(e){var t=e.theme,n=e.ownerState;return Object(s.b)({theme:t},n.direction,(function(e){var t={flexDirection:e};return 0===e.indexOf("column")&&(t["& > .".concat(x.item)]={maxWidth:"none"}),t}))}),(function(e){var t=e.theme,n=e.ownerState,i=n.container,a=n.rowSpacing,c={};return i&&0!==a&&(c=Object(s.b)({theme:t},a,(function(e){var n=t.spacing(e);return"0px"!==n?Object(r.a)({marginTop:"-".concat(O(n))},"& > .".concat(x.item),{paddingTop:O(n)}):{}}))),c}),(function(e){var t=e.theme,n=e.ownerState,i=n.container,a=n.columnSpacing,c={};return i&&0!==a&&(c=Object(s.b)({theme:t},a,(function(e){var n=t.spacing(e);return"0px"!==n?Object(r.a)({width:"calc(100% + ".concat(O(n),")"),marginLeft:"-".concat(O(n))},"& > .".concat(x.item),{paddingLeft:O(n)}):{}}))),c}),(function(e){var t=e.theme,n=e.ownerState;return t.breakpoints.keys.reduce((function(e,r){return function(e,t,n,r){var i=r[n];if(i){var c={};if(!0===i)c={flexBasis:0,flexGrow:1,maxWidth:"100%"};else if("auto"===i)c={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"};else{var o=Object(s.d)({values:r.columns,base:t.breakpoints.values}),d="".concat(Math.round(i/o[n]*1e8)/1e6,"%"),p={};if(r.container&&r.item&&0!==r.columnSpacing){var u=t.spacing(r.columnSpacing);if("0px"!==u){var l="calc(".concat(d," + ").concat(O(u),")");p={flexBasis:l,maxWidth:l}}}c=Object(a.a)({flexBasis:d,flexGrow:0,maxWidth:d},p)}0===t.breakpoints.values[n]?Object.assign(e,c):e[t.breakpoints.up(n)]=c}}(e,t,r,n),e}),{})})),y=c.forwardRef((function(e,t){var n,r=Object(l.a)({props:e,name:"MuiGrid"}),s=Object(d.a)(r),u=s.className,g=s.columns,m=void 0===g?12:g,h=s.columnSpacing,b=s.component,x=void 0===b?"div":b,O=s.container,y=void 0!==O&&O,M=s.direction,W=void 0===M?"row":M,k=s.item,z=void 0!==k&&k,G=s.lg,T=void 0!==G&&G,P=s.md,C=void 0!==P&&P,_=s.rowSpacing,A=s.sm,B=void 0!==A&&A,D=s.spacing,N=void 0===D?0:D,R=s.wrap,J=void 0===R?"wrap":R,L=s.xl,E=void 0!==L&&L,F=s.xs,H=void 0!==F&&F,I=s.zeroMinWidth,q=void 0!==I&&I,K=Object(i.a)(s,w),Q=_||N,U=h||N,V=c.useContext(f)||m,X=Object(a.a)({},s,{columns:V,container:y,direction:W,item:z,lg:T,md:C,sm:B,rowSpacing:Q,columnSpacing:U,wrap:J,xl:E,xs:H,zeroMinWidth:q}),Y=function(e){var t=e.classes,n=e.container,r=e.direction,i=e.item,a=e.lg,c=e.md,o=e.sm,s=e.spacing,d=e.wrap,u=e.xl,l=e.xs,f={root:["root",n&&"container",i&&"item",e.zeroMinWidth&&"zeroMinWidth",n&&0!==s&&"spacing-xs-".concat(String(s)),"row"!==r&&"direction-xs-".concat(String(r)),"wrap"!==d&&"wrap-xs-".concat(String(d)),!1!==l&&"grid-xs-".concat(String(l)),!1!==o&&"grid-sm-".concat(String(o)),!1!==c&&"grid-md-".concat(String(c)),!1!==a&&"grid-lg-".concat(String(a)),!1!==u&&"grid-xl-".concat(String(u))]};return Object(p.a)(f,v,t)}(X);return n=Object(j.jsx)(S,Object(a.a)({ownerState:X,className:Object(o.a)(Y.root,u),as:x,ref:t},K)),12!==V?Object(j.jsx)(f.Provider,{value:V,children:n}):n}));t.a=y},581:function(e,t,n){"use strict";var r=n(59);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;!function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var n=c(t);if(n&&n.has(e))return n.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var o=i?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(r,a,o):r[a]=e[a]}r.default=e,n&&n.set(e,r)}(n(1));var i=r(n(70)),a=n(4);function c(e){if("function"!==typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(c=function(e){return e?n:t})(e)}var o=(0,i.default)((0,a.jsx)("path",{d:"M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"}),"GitHub");t.default=o},598:function(e,t,n){"use strict";n.r(t);var r=n(576),i=n(12),a=n(571),c=n(561),o=n(4),s=Object(i.a)(a.a)((function(e){return{width:"90%",padding:e.theme.spacing(3)}})),d=Object(i.a)(c.a)((function(e){var t=e.theme;return{padding:t.spacing(1),letterSpacing:t.spacing(.07)}})),p=function(){return Object(o.jsxs)(s,{children:[Object(o.jsx)(d,{paragraph:!0,children:"This is a Solana-powered decentralized governance platform where participants can create tokens that represent the voting power of their holder in a deliberative democracy setting."}),Object(o.jsx)(d,{paragraph:!0,children:"The initializer assigns the token's mint authority to a smart contract that everyone can trust and whose source code is available on Github. The contract gives each participant 1 token, representing 1 vote. The receiver can divide their vote into 100 pieces and distribute it to other participants."}),Object(o.jsx)(d,{paragraph:!0,children:"After a specified number of days, the participants with the most voting power can propose one alternative each. The rest of the participants assign percentages of their voting power on each alternative, representing their preference."})]})},u=n(34),l=n(216),f=function(){var e=Object(u.f)();return Object(o.jsx)(l.a,{onClick:function(){e.push("/mint/")},children:"GO MINT SOME"})},g=n(581),m=n.n(g),h=Object(i.a)("a")((function(){return{color:"#f9f9f9",textDecoration:"none",justifyContent:"center",textAlign:"center"}})),v=function(){return Object(o.jsx)(l.a,{children:Object(o.jsx)(h,{href:"https://github.com/fuzzc0re/deliberatively",target:"_blank",rel:"noopener noreferrer",children:Object(o.jsx)(m.a,{})})})},b=Object(i.a)(r.a)((function(e){return{padding:e.theme.spacing(3),textAlign:"center",justifyContent:"space-evenly"}}));t.default=function(){return Object(o.jsxs)(r.a,{container:!0,rowSpacing:{xs:2,sm:3,md:4},columnSpacing:{xs:2,sm:3,md:4},columns:{xs:1,sm:4,md:8},direction:{xs:"column",sm:"row"},children:[Object(o.jsx)(r.a,{item:!0,xs:1,sm:4,md:8,children:Object(o.jsx)(p,{})}),Object(o.jsxs)(b,{item:!0,xs:1,sm:4,md:8,children:[Object(o.jsx)(f,{}),Object(o.jsx)(v,{})]})]})}}}]);
//# sourceMappingURL=5.bc1a8efc.chunk.js.map