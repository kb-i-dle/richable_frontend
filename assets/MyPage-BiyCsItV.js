import{_ as V,r as i,m as C,b as Y,c as u,a as e,z as d,w as g,v as k,E as z,e as T,L as N,F as K,A as R,M as h,o as m,p as q,j as G}from"./index-E7HFo_Uv.js";import{a as A}from"./axios-CCb-kr4I.js";const F="/richable_frontend/assets/noprofile1-CE9pGWt1.png",l=f=>(q("data-v-56f3de31"),f=f(),G(),f),W={class:"mypage-container"},H={class:"top-section d-flex justify-content-between"},J={class:"profile-section box"},O=l(()=>e("h5",{class:"bold-text text-left"},"나의 프로필",-1)),Q={class:"profile"},X=["src"],Z={class:"mt-3"},ee={class:"api-management box text-left"},te=l(()=>e("h4",{class:"bold-text"},"API 관리",-1)),se=l(()=>e("br",null,null,-1)),oe={class:"list-unstyled"},le={class:"d-flex align-items-center"},ae=l(()=>e("span",null,"은행 api key",-1)),ne={class:"ms-3"},ie={class:"d-flex align-items-center"},de=l(()=>e("span",null,"증권 api key",-1)),ce={class:"ms-3"},re={class:"d-flex align-items-center"},ue=l(()=>e("span",null,"암호화폐 api key",-1)),me={class:"ms-3"},pe={class:"d-flex align-items-center"},be=l(()=>e("span",null,"동의여부",-1)),_e={class:"ms-3"},ge={key:0,class:"mt-3"},he=["placeholder"],fe={class:"badge-section box mt-5"},ve={class:"d-flex justify-content-between align-items-center"},ye=l(()=>e("h1",{class:"badge-title bold-text"},"나의 뱃지",-1)),ke={class:"badges d-flex justify-content mt-5"},xe={class:"representative-badge text-center"},Ie=l(()=>e("h6",{class:"bold-text"},"대표 뱃지",-1)),Me=l(()=>e("br",null,null,-1)),Ae={key:0,class:"text-center"},we=["src"],Ce={class:"d-flex align-items-center justify-content-center mt-2"},Ke=l(()=>e("p",{class:"mb-0 ms-2"},"대표 뱃지 등록",-1)),Fe={key:1},Se=l(()=>e("p",null,"뱃지",-1)),Be=[Se],Pe={class:"d-flex flex-column align-items-start"},Ue=l(()=>e("h6",{class:"bold-text"},"내가 획득한 뱃지",-1)),Ee=l(()=>e("br",null,null,-1)),Le={class:"d-flex justify-content-start"},$e=["onClick"],je={class:"badge-name"},De=["src"],Ve=l(()=>e("div",{class:"modal-header"},[e("h5",{class:"modal-title",id:"deleteModalLabel"},"회원 탈퇴 확인"),e("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),Ye=l(()=>e("div",{class:"modal-body"},[e("p",null,"정말로 회원 탈퇴하시겠습니까?"),e("br"),e("p",null,"모든 정보가 삭제됩니다.")],-1)),ze={class:"modal fade",id:"profileModal",tabindex:"-1","aria-labelledby":"profileModalLabel","aria-hidden":"true"},Te={class:"modal-dialog modal-dialog-centered"},Ne={class:"modal-content"},Re=l(()=>e("div",{class:"modal-header"},[e("h5",{class:"modal-title",id:"profileModalLabel"},"회원 정보 수정"),e("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),qe={class:"modal-body"},Ge={class:"profile-edit text-center"},We=["src"],He=l(()=>e("br",null,null,-1)),Je={class:"form-group mt-2 d-flex align-items-center"},Oe=l(()=>e("label",{for:"nickname",class:"me-2",style:{"white-space":"nowrap"}},"닉네임",-1)),Qe={class:"form-group mt-2 d-flex align-items-center"},Xe=l(()=>e("label",{for:"email"},"E-Mail",-1)),Ze={class:"form-group mt-2 d-flex align-items-center"},et=l(()=>e("label",{for:"birthYear"},"생년월일",-1)),tt={class:"form-group mt-2 d-flex align-items-center"},st=l(()=>e("label",{for:"gender"},"성별",-1)),ot=["value"],lt={class:"modal-footer"},at=l(()=>e("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},"취소",-1)),nt={__name:"MyPage",setup(f){const x=localStorage.getItem("authToken"),a=i({id:"",name:"",email:"",birthYear:"",gender:"",profileImage:F}),v=i(a.value.profileImage),I=i(!1),p=i(""),b=i(""),y=s=>{p.value=s==="bank"?"은행":s==="stock"?"증권":s==="crypto"?"암호화폐":"동의",I.value=!0},S=()=>{p.value==="은행"?n.value.bankApiKey=b.value:p.value==="증권"?n.value.stockApiKey=b.value:p.value==="암호화폐"&&(n.value.cryptoApiKey=b.value),I.value=!1},B=C(()=>a.value.gender==="M"?"남자":a.value.gender==="F"?"여자":"성별 정보 없음");A.interceptors.request.use(s=>(x&&(s.headers.Authorization=`Bearer ${x}`),s),s=>Promise.reject(s));const P=()=>{const s=document.createElement("input");s.type="file",s.accept="image/*",s.click(),s.addEventListener("change",t=>{const o=t.target.files[0];if(o){const r=new FileReader;r.onload=_=>v.value=_.target.result,r.readAsDataURL(o)}})},U=()=>{const s=a.value.name;if(console.log("닉네임:",s),!s){alert("사용자 ID가 없습니다.");return}A.delete(`http://localhost:8080/member/delete/${s}`,{headers:{Authorization:`Bearer ${x}`}}).then(()=>{alert("회원 탈퇴가 완료되었습니다."),localStorage.removeItem("authToken"),window.location.href="/user/SignIn"}).catch(t=>{console.error("회원 탈퇴 중 에러 발생:",t),alert("회원 탈퇴에 실패했습니다.")})},E=()=>{const s=h.Modal.getInstance(document.getElementById("deleteModal"));s&&s.hide(),new h.Modal(document.getElementById("profileModal")).show()},L=()=>{new h.Modal(document.getElementById("profileModal")).show()},$=()=>{const s=h.Modal.getInstance(document.getElementById("profileModal"));s&&s.hide(),new h.Modal(document.getElementById("deleteModal")).show()},n=i({bankApiKey:"",stockApiKey:"",cryptoApiKey:"",consentStatus:""}),w=i([{id:1,name:"사과러버 리치",imageUrl:"/images/badge-apple-rich.png",isSelected:!1},{id:2,name:"부릉부릉 리치",imageUrl:"/images/badge-car-rich.png",isSelected:!1},{id:3,name:"저금통 리치",imageUrl:"/images/badge-coin-box-rich.png",isSelected:!1},{id:4,name:"럭셔리 리치",imageUrl:"/images/badge-luxury-rich.png",isSelected:!1}]),M=i(null),c=C(()=>w.value.find(s=>s.id===M.value)),j=s=>M.value=s.id,D=s=>{s.isSelected||(M.value=null)};return Y(()=>{A.get("http://localhost:8080/member/info").then(s=>{var o,r,_;const t=((o=s.data.response.data)==null?void 0:o.data)||{};a.value={id:t.id||"",name:t.nickname||"이름 없음",email:t.email||"이메일 없음",birthYear:t.birthYear||"",gender:t.gender||"",profileImage:t.img||F},v.value=a.value.profileImage,t.api?n.value={bankApiKey:t.api.bank||"API 키 없음",stockApiKey:((r=t.api.stock)==null?void 0:r.base)||"API 키 없음",cryptoApiKey:((_=t.api.coin)==null?void 0:_.base)||"API 키 없음",consentStatus:t.certification?"동의함":"동의 안함"}:n.value={bankApiKey:"API 키 없음",stockApiKey:"API 키 없음",cryptoApiKey:"API 키 없음",consentStatus:"동의 안함"}}).catch(s=>console.error("프로필 정보와 API 키를 가져오는 중 오류 발생:",s))}),(s,t)=>(m(),u(K,null,[e("div",W,[e("div",H,[e("section",J,[O,e("div",Q,[e("img",{src:v.value,alt:"프로필 이미지"},null,8,X),e("h2",Z,d(a.value.name),1),e("button",{class:"btn btn-danger mt-3",onClick:L,style:{"background-color":"#FF0062","border-color":"#FF0062"}},"프로필 수정")])]),e("section",ee,[te,se,e("ul",oe,[e("li",le,[ae,e("span",ne,d(n.value.bankApiKey),1),e("button",{class:"btn btn-link ms-auto",onClick:t[0]||(t[0]=o=>y("bank"))},"➡️")]),e("li",ie,[de,e("span",ce,d(n.value.stockApiKey),1),e("button",{class:"btn btn-link ms-auto",onClick:t[1]||(t[1]=o=>y("stock"))},"➡️")]),e("li",re,[ue,e("span",me,d(n.value.cryptoApiKey),1),e("button",{class:"btn btn-link ms-auto",onClick:t[2]||(t[2]=o=>y("crypto"))},"➡️")]),e("li",pe,[be,e("span",_e,d(n.value.consentStatus),1),e("button",{class:"btn btn-link ms-auto",onClick:t[3]||(t[3]=o=>y("consent"))},"➡️")])]),I.value?(m(),u("div",ge,[g(e("input",{type:"text",class:"form-control mb-2",placeholder:p.value+" API 키 입력","onUpdate:modelValue":t[4]||(t[4]=o=>b.value=o)},null,8,he),[[k,b.value]]),e("button",{class:"btn btn-primary",onClick:S},"저장")])):z("",!0)])]),e("section",fe,[e("div",ve,[ye,e("a",{href:"#",class:"text-end",onClick:t[5]||(t[5]=T((...o)=>s.openBadgeModal&&s.openBadgeModal(...o),["prevent"])),style:{color:"#FF0062"}},"전체보기")]),e("div",ke,[e("div",xe,[Ie,Me,c.value?(m(),u("div",Ae,[e("p",null,d(c.value.name),1),e("img",{src:c.value.imageUrl,alt:"대표 뱃지 이미지",class:"badge-image"},null,8,we),e("label",Ce,[g(e("input",{type:"checkbox","onUpdate:modelValue":t[6]||(t[6]=o=>c.value.isSelected=o),onChange:t[7]||(t[7]=o=>D(c.value))},null,544),[[N,c.value.isSelected]]),Ke])])):(m(),u("div",Fe,Be))]),e("div",Pe,[Ue,Ee,e("div",Le,[(m(!0),u(K,null,R(w.value,(o,r)=>(m(),u("div",{key:o.id,class:"badge-item text-center",onClick:_=>j(o)},[e("p",je,d(o.name),1),e("img",{src:o.imageUrl,alt:"뱃지 이미지",class:"badge-image"},null,8,De)],8,$e))),128))])])])]),e("div",{class:"modal fade",id:"deleteModal",tabindex:"-1","aria-labelledby":"deleteModalLabel","aria-hidden":"true"},[e("div",{class:"modal-dialog modal-dialog-centered"},[e("div",{class:"modal-content"},[Ve,Ye,e("div",{class:"modal-footer"},[e("button",{type:"button",class:"btn btn-secondary",onClick:E},"아니오"),e("button",{type:"button",class:"btn btn-danger",onClick:U},"예")])])])])]),e("div",ze,[e("div",Te,[e("div",Ne,[Re,e("div",qe,[e("div",Ge,[e("img",{src:v.value,alt:"프로필 이미지",class:"img-thumbnail",style:{width:"400px",height:"400px"}},null,8,We),He,e("button",{class:"btn btn-outline-secondary mt-1 bold-text",onClick:P},"프로필 이미지 변경"),e("input",{type:"file",ref:"fileInput",onChange:t[8]||(t[8]=(...o)=>s.onFileChange&&s.onFileChange(...o)),accept:"image/*",style:{display:"none"}},null,544),e("div",Je,[Oe,g(e("input",{type:"text",class:"form-control",id:"nickname","onUpdate:modelValue":t[9]||(t[9]=o=>a.value.name=o),style:{width:"auto","flex-grow":"1"}},null,512),[[k,a.value.name]])]),e("div",Qe,[Xe,g(e("input",{type:"email",class:"form-control",id:"email","onUpdate:modelValue":t[10]||(t[10]=o=>a.value.email=o),style:{width:"auto","flex-grow":"1"}},null,512),[[k,a.value.email]])]),e("div",Ze,[et,g(e("input",{type:"number",class:"form-control",id:"birthYear","onUpdate:modelValue":t[11]||(t[11]=o=>a.value.birthYear=o),style:{width:"auto","flex-grow":"1"}},null,512),[[k,a.value.birthYear]])]),e("div",tt,[st,e("input",{class:"form-control",id:"gender",value:B.value,style:{width:"auto","flex-grow":"1"},readonly:""},null,8,ot)])])]),e("div",lt,[e("button",{type:"button",class:"btn btn-danger",style:{position:"absolute",left:"10px","background-color":"#FF0062"},onClick:$},"회원 탈퇴"),at,e("button",{type:"button",class:"btn btn-danger",onClick:t[12]||(t[12]=(...o)=>s.saveProfile&&s.saveProfile(...o)),style:{"background-color":"#FF0062","border-color":"#FF0062"}},"수정")])])])])],64))}},ct=V(nt,[["__scopeId","data-v-56f3de31"]]);export{ct as default};
