# 第7–10关还原工作区

## 0.2.141：石环阵毒南瓜基础链

正式可玩仍为前六关18模式，`PLAYABLE_STAGE_COUNT=6`。第7关只允许内部隔离加载，生产 Repository、地图、奖励和存档边界没有放开。其余第7关机制、自然三模式、通知/百科/旗路/书页及发布验收尚未完成，不称21模式。

原APK没有独立的 `level07.lua`。本关声明是 `level07_data/paths/waves`，实体控制器在 `kr3/game_scripts.lua` 与共享 `all/scripts.lua`。原中文关名从APK字符串表读取为“石环阵”。指定视频的第7关战役为 BV1y8411R7iB P20 / CID1232909071；125秒帧已人工查看。P21/P22为英雄/钢铁挑战。视频英雄、经济与输入不同，仅作同关参考，不是同步像素验收；来源记录在 `tools/sources/stage7-video.json`。

### 已实现

- 原三株 `plant_poison_pumpkin`，位置(335,243)/(859,536)/(471,685)。开波且未封锁后重新计25秒恢复，原25帧ready后进入可点击状态；wave0不能偷用。点击不要求已有敌人，空放也消耗。shoot29帧结束后开始下一轮恢复；已经开始的释放不被中途封锁打断。
- 原9/15/17帧三组烟雾；第17帧查询当前位置170/.7椭圆内合法目标，使用原 `vis_flags=1048578`，没有凭感觉加地面目标限制。减速与中毒分别排队，下一模拟tick插入，毒伤再次排队提交，不借主英雄XP。
- 原slow factor .5、duration4，乘当前速度、结束除回自身倍率；同名刷新时间不叠减速。死亡/移除只释放自己的modifier，不清Arcane/Blade/外部眩晕计数。当前是这两种固定level1 modifier的职责适配，不冒通用多等级引擎。
- `scripts.mod_dps` 原每.1秒一个整数随机2..2，固定范围也消耗随机；首周期立即产生，4秒共40次。原32800是 `DAMAGE_POISON32 | DAMAGE_MODIFIER32768`，不是NO_SHIELD_HIT。按目标毒抗、health damage_factor与原floor处理，不误用物甲/魔甲，不加最小1假伤害；可以击杀并发一次原金币奖励。ignore_damage/immune_to仍生效。
- 头标使用原poison_violet small/medium/big动画及unit.mod_offset、目标z；原三处idle粒子与12处烟雾按source anchor/trim/alpha/tween、两轴翻转绘制，fill镜像offset单独处理。原click_rect(-30,-5,60,54)按当前相机缩放定位真实按钮，桌面和手机触摸均走 `World.activatePlant`。原声音、ready通知图标与成就播放仍未接，未虚构声音已还原。

### 按需资源与边界

`web/stages/stage7.mjs` / `pumpkin.mjs` 置于子目录，只在显式内部加载第7关时动态import。build复制并检查子目录模块，但不会把它们加入顶层modulepreload。大声明/图只在 `assets/stage7`，旧前六关不请求此组。

World只新增可选 `data.stageRuntime` 的init/step/activatePlant接口，Renderer对应只读drawPlant/draw接口。只有stage7 loader提供该对象；旧World不产生pumpkin state/字段/RNG。对象状态全在World，无timer或跨场景缓存。真正关卡入场仍须完整decode并通过既有owner/current guard。

`extract_stage7.py`读取原声明、对controllers只做-bl与prototype常量检查，`read_pumpkin_functions.lua`使用声明stub定位真实继承：plant为game_scripts.plant_poison_pumpkin，poison为scripts.mod_dps，slow为scripts.mod_slow+mod_track_target。不执行controllers、不移植mixed mod。源码、PNG/声明SHA固定，4623逻辑帧/6,314,902B独立组，逐RGBA/size/trim无损；当前含保守共用依赖，不声称已是最小资源闭包。原4/5/6三图逐字节不变，旧compact仍1314帧/2,122,316B。

第7隔离冷入口实测 **16,852,393B/230req**，book7.419秒/总17.573秒，15MB断言正常exit1。base catalog/进度/draw快照不变，无missing或未decode实际调用；不是正式flag7/book7路径。预算没有通过，不抬门槛、降质或删当前必需图，入口继续关闭。

### 验证

611项Node全过（10个新增pumpkin测试）。实际build的pumpkin-browser-publish真实Space开波、25秒准备、真实空放、对原130HP剑蜘蛛释放，原40次毒伤经.5毒抗后HP130→90，速度51→25.5→51，850金币不变；原Canvas q/alpha/flipY/队列矩阵、完整循环安全World快照、无missing/unready、真实暂停、844×390 CDP触摸南瓜与暂停、退图清理均正常exit0。桌面/手机图已人工看。样本有受控队列和目标位置，非天然第7通关或原版同输入帧。

初包真实Canvas发现DefenseFlag与poison_violet有metadata但未decode：不能因它们在go_towers中就整类跳过。实际按已有tower专用组的frame清单排除，只把未提供的完整依赖纳入新组，修后绿；未吞missing。纯测17/30浮点边界改下一原frame采样，不改产品阈值。首次browser从title直接隔离后退图，正常mapInitialized/upgrades归一化被fixture误判；改先真实title/save/map初始化再比较完整进度，产品不改迁就fixture。

原天然九模式/存档手机、连续新档4/5/6自然链与UI/public UI通过。4campaign19命三星/heroic142/iron95；5campaign20命/heroic201/iron147/XP37600；6campaign20命零漏/真实首领收尾→heroic120/iron169/末XP47121。所有当前运行模块与stage7资源逐字节等最终build。

最终cold100ms/1.5MBps/cacheoff：旧14,856,512B/240req，总16.155s；4真实旗书14,813,890B/230req，book7.213s/总17.122s；5真实旗书14,997,198B/241req，book7.850s/总17.743s；6真实旗书14,937,868B/240req，book8.154s/总23.729s，均exit0。不保所有线路。**第五仅余2802B**，后续第7大数据/模块必须继续按关加载，不能全局静态导入。第6boss/cart事件仍另实际下载约3.87MB，不冒整局总流量<15MB。

## 下一步

优先补原faerie_trails路径速度机关，或satyr_cutthroat两次掷刀/相应投射物、hoplite召唤链的一条真实连续流程。新敌目前导入声明/图和通用运动并不等于专有AI完成；普通generic ranged不足以代替两次shoot_times。webspitting spider专用蛛网、原允许的Druid等高级塔分支、ready/敌人通知与百科、成就/声音、自然三模式、预算及真正发布链也未全。

第7关充分验收后才扩cap、原旗路、书页与奖励存档。不要继续无限磨已完毒南瓜/旧HUD/4–6固定策略，也不要只因资源存在就开放7。整体原grid、native队列/IDs/global z、旧箭物理、Arivan、安全区、特殊death、血池、完整音频与宝石天赋仍有差异，不称整体1:1。

最终交付构建1678文件104,578,733B（含manifest）；runtime main a1b2ea6、Pages b9f03f4均推送。私有Site source74007759bb6e0a11a3274e0624765f6626ff87d0，deploy appgdep_6aee318f07608191bc8949fa5d76d4e8 succeeded，owner-only保持。公开站本轮一次manifest确认0.2.140/public UI正常exit0，新推送不轮询CI。Sites技能位置已更新为1.1.4，旧1.1.3不存在；helper/native各一次成功，无重复部署。

主要日志：artifacts/pumpkin-tests-publish.log、pumpkin-build-publish.log、pumpkin-browser-publish.log、pumpkin-source-pinned.log、pumpkin-groups.log、pumpkin-natural.log、pumpkin-old-nine.log、pumpkin-ui.log、pumpkin-pages-ui.log，以及pumpkin-performance.log/stage4-performance/stage5-performance/stage6-performance/stage7-budget。第7预算是正常exit1，其他最终专项均正常exit0。HTTP29429比daemon88207后精确TERM，owned server正常收143，所有结果收齐无后台。
