// Desktop common book face; deliberately separate from all-phone font roles.
// Source and hash are recorded in assets/fonts/book-source.json.
export function bookFontStyle(size,ref={x:592}){return `font-family:OriginsBook;font-weight:400;font-synthesis:none;font-size:${size/ref.x*100}cqw`;}
export function difficultyNode(node,value){const n=Math.max(1,Math.min(3,Number(value)||1));return{...node,default_image_name:`levelSelect_difficulty_${String(n*2-1).padStart(4,'0')}`,click_image_name:`levelSelect_difficulty_${String(n*2).padStart(4,'0')}`};}
let ready;
export function waitForBookFont(fonts=document.fonts){
 if(!ready)ready=fonts.load('400 20px OriginsBook','瀑布小径战役').then(f=>{if(!f.length)throw new Error('Book font not registered');}).catch(error=>{ready=null;throw error;});
 return ready;
}
