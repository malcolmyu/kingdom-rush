// Original all-phone font_subst: map the source font, not a guessed role name.
export const originalFonts={
 'NotoSansCJKkr-Regular':{family:'OriginsCJK',weight:400},
 'NotoSansCJKkr-Bold':{family:'OriginsCJK',weight:700},
 SohoGothicProMedium:{family:'OriginsNumbers',weight:400},
 'Comic Book Italic':{family:'OriginsNumbersItalic',weight:400},
 TOONISH:{family:'OriginsNumbersBold',weight:400}
};
export function fontRole(fonts,role){const f=fonts?.roles?.[role];return{...(originalFonts[f?.name]||originalFonts['NotoSansCJKkr-Regular']),scale:f?.metrics?.size||1};}
export async function waitForOriginalFonts(fonts=document.fonts){await Promise.all(Object.values(originalFonts).map(async f=>{const loaded=await fonts.load(`${f.weight} 16px ${f.family}`);if(!loaded.length)throw new Error('原字体未注册：'+f.family);}));}
