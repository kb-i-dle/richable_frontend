import{a as b}from"./axios-CCb-kr4I.js";import"./AxiosInstance--4YUcpg_.js";import{_ as A,r as d,b as w,c as r,a as t,F as p,A as v,o as c,n as x,z as a,p as I,j as S}from"./index-E7HFo_Uv.js";const g=n=>(I("data-v-b1494373"),n=n(),S(),n),B={style:{"margin-bottom":"100px"},class:"top-return-asset-page container"},z=g(()=>t("div",{class:"total-asset"},[t("div",{class:"total-asset-sub"},"리치들이 투자한 상품 중 "),t("div",{class:"total-asset-title"},"전일 대비 수익률이 높은 자산은?")],-1)),F={class:"filters"},T=["onClick"],C={class:"card-container"},P={key:0},j={class:"rank"},L={style:{"margin-left":"30px"}},R={class:"type"},$={class:"name"},D={style:{display:"flex","flex-direction":"row","justify-content":"space-between"}},E={style:{"font-size":"24px"},class:"return-rate"},M={class:"price",style:{"margin-left":"45px"}},N={class:"table-card card"},V={class:"table"},q=g(()=>t("thead",{class:"thead-light"},[t("tr",null,[t("th",{style:{width:"10%"}},"순위"),t("th",{style:{width:"15%"}},"종류"),t("th",{style:{width:"30%"}},"자산명"),t("th",{style:{width:"25%"}},"가격"),t("th",{style:{width:"25%"}},"수익률")])],-1)),G={class:"return-rate"},H={__name:"TopReturnAssetPage",setup(n){const f=localStorage.getItem("authToken"),m=["전체","주식","코인"],i=d("전체"),h=d([]),u=d([]);let _=d([]);const y=async o=>{i.value=o;let l="http://localhost:8080/invest/highreturn";o==="주식"?l="http://localhost:8080/invest/highreturn/stock":o==="코인"&&(l="http://localhost:8080/invest/highreturn/coin");try{const e=await b.get(l,{headers:{Authorization:`Bearer ${f}`}});e.data.success?(_.value=e.data.response.data.map(s=>({name:s.name,category:s.category,rate:parseFloat(s.rate.replace("%","")),price:s.price.toLocaleString()})),k()):console.error("API 응답 실패:",e.data.message)}catch(e){console.error("자산 데이터를 불러오는 중 오류 발생:",e)}},k=()=>{let o=_.value;i.value!=="전체"&&(o=_.value.filter(l=>l.category===i.value)),o.sort((l,e)=>e.rate-l.rate),u.value=o,h.value=u.value.slice(0,3)};return w(()=>{y("전체")}),(o,l)=>(c(),r("div",B,[z,t("div",F,[(c(),r(p,null,v(m,(e,s)=>t("button",{key:s,class:x(["filter-btn",i.value===e?"active":"inactive"]),onClick:J=>y(e)},a(e),11,T)),64))]),t("div",C,[h.value.length===0?(c(),r("div",P,"상위 자산이 없습니다.")):(c(!0),r(p,{key:1},v(h.value,(e,s)=>(c(),r("div",{key:s,class:"custom-card"},[t("div",j,a(s+1),1),t("div",L,[t("div",R,a(e.category),1),t("div",$,a(e.name),1),t("div",D,[t("div",E,a(e.rate)+"%",1),t("div",M,a(e.price)+"원",1)])])]))),128))]),t("div",N,[t("table",V,[q,t("tbody",null,[(c(!0),r(p,null,v(u.value,(e,s)=>(c(),r("tr",{key:s},[t("td",null,a(s+1),1),t("td",null,a(e.category),1),t("td",null,a(e.name),1),t("td",null,a(e.price)+"원",1),t("td",G,a(e.rate)+" %",1)]))),128))])])])]))}},U=A(H,[["__scopeId","data-v-b1494373"]]);export{U as default};
