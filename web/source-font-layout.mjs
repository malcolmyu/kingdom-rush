import{fontRole}from'./font-roles.mjs';
// game_gui.initialize -> GGLabel._load_font -> font_db.f.
// Font raster size is physical; the parent GUI transform is already included.
export function sourceFontPixels(size,roleScale,guiScale){const pixels=size*roleScale*guiScale;return pixels>6?Math.floor(pixels+.5):pixels;}
// GGLabel.fit_lines=1: retry the source logical size in .5 steps.
// This branch is for the HUD's single-line counters, not general paragraph wrap.
export function fitHudFont(fonts,node,guiScale,text,measure){const role=fontRole(fonts,node.font_name);let logicalSize=node.font_size,pixels=sourceFontPixels(logicalSize,role.scale,guiScale);if(node.fit_lines===1)while(logicalSize>=1&&measure(text,{...role,pixels})>node.size.x*guiScale){logicalSize-=node.fit_step??.5;pixels=sourceFontPixels(logicalSize,role.scale,guiScale);}if(logicalSize<1){logicalSize=node.font_size;pixels=sourceFontPixels(logicalSize,role.scale,guiScale);}return{...role,logicalSize,pixels};}
