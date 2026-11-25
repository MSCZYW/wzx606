# 数据库记录（一律追加写入，禁止覆盖已有内容）

按执行顺序追加 SQL 语句（含测试数据的 INSERT），仅凭本文件即可在新机器上完整重建数据库。

---

（暂无建表记录，数据库：wzx_web）

## 2026-11-20 建库、建表 wzx_news 并插入测试数据

-- 1. 建库（如不存在）
CREATE DATABASE IF NOT EXISTS wzx_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wzx_web;

-- 2. 建表 wzx_news（科技新闻表）
CREATE TABLE IF NOT EXISTS wzx_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT '新闻标题',
  summary VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  content TEXT COMMENT '新闻正文',
  source VARCHAR(100) NOT NULL COMMENT '新闻来源',
  publish_time DATETIME NOT NULL COMMENT '发布时间',
  cover_img VARCHAR(500) DEFAULT NULL COMMENT '封面图地址',
  INDEX idx_publish_time (publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

-- 3. 插入 10 条科技新闻测试数据（在 wzx_web 库中执行）
INSERT INTO wzx_news (title, summary, content, source, publish_time, cover_img) VALUES
('国产超大规模模型开源，推理成本再降一个数量级', '国内科研团队发布新一代开源大模型，参数规模达万亿级，通过混合专家架构将推理成本降低约十倍，已同步开放权重与训练细节。', '11月19日，国内某科研团队正式开源新一代超大规模语言模型。该模型采用混合专家（MoE）架构，总参数量突破万亿，在数学推理、代码生成与多语言理解等基准测试中取得领先成绩。团队同时公布了完整的训练细节与评测脚本，并宣布推理成本较上一代下降约十倍，开发者可免费商用。业内认为，此举将进一步降低大模型应用门槛，加速行业落地。', '科技日报', '2026-11-19 09:30:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20AI%20neural%20network%20glowing%20blue%20chip%2C%20tech%20news%20cover%2C%20professional%20photography&image_size=landscape_16_9'),
('我国商业运载火箭成功实施一箭多星发射', '某商业航天公司的新型运载火箭完成首次一箭六星发射任务，六颗卫星全部精准入轨，标志着我国商业航天发射能力再上新台阶。', '昨日上午，我国某商业航天公司自主研发的新型液体运载火箭在酒泉卫星发射中心点火升空，以一箭六星方式将六颗小卫星送入预定轨道。这是该型号火箭的首次多星组网发射，卫星将服务于低轨物联网与遥感数据采集。公司表示，下一阶段将开展火箭回收试验，力争实现重复使用。', '新华网', '2026-11-18 16:20:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rocket%20launch%20at%20dawn%2C%20flames%20and%20smoke%2C%20space%20technology%20news%20cover%2C%20cinematic&image_size=landscape_16_9'),
('全球首款2nm制程手机芯片亮相', '国际芯片巨头发布全球首款采用2纳米制程的移动处理器，晶体管密度提升30%，能耗降低25%，首批旗舰机型将于明年上市。', '在今日举行的芯片技术峰会上，国际芯片巨头展示了全球首款基于2纳米GAA制程的移动处理器。官方数据显示，相较上一代3纳米产品，新芯片晶体管密度提升约30%，同等性能下能耗降低25%。多家手机厂商已宣布首批搭载计划，量产机型预计于明年上半年发布。', '36氪', '2026-11-17 11:05:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=macro%20closeup%20of%20advanced%20semiconductor%20chip%20on%20circuit%20board%2C%20blue%20lighting%2C%20tech%20news%20cover&image_size=landscape_16_9'),
('量子计算原型机实现千万量子比特级纠错', '科研团队在超导量子计算领域取得突破，新型纠错方案将逻辑量子比特错误率降低至实用门槛以下，向通用量子计算迈出关键一步。', '国内科研团队日前宣布，其超导量子计算原型机在纠错技术上取得关键突破：通过动态解耦与表面码联合方案，逻辑量子比特的错误率首次降至实用化门槛以下，并完成千次连续运行验证。论文已发表于国际权威期刊。研究人员表示，下一步将扩展物理量子比特规模，推进专用量子模拟器研发。', '科技日报', '2026-11-16 14:40:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20computer%20golden%20cryostat%20in%20laboratory%2C%20futuristic%20science%20news%20cover%2C%20professional%20photo&image_size=landscape_16_9'),
('全固态电池量产中试线投产，续航有望突破1500公里', '某新能源企业宣布全固态电池量产中试线正式投产，能量密度较现有液态锂电池提升一倍以上，预计两年内实现整车搭载。', '位于合肥的全固态电池量产中试线本周正式投产。该产线采用硫化物电解质路线，电芯能量密度达500Wh/kg，是当前主流液态锂电池的两倍以上。企业负责人透露，配套的整车测试已完成冬季高寒标定，搭载车型续航有望突破1500公里，计划2028年实现规模化装车。', '澎湃新闻', '2026-11-15 10:15:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20car%20battery%20cells%20production%20line%2C%20modern%20factory%2C%20technology%20news%20cover%2C%20photorealistic&image_size=landscape_16_9'),
('人形机器人完成机场全天候真实运营测试', '某机器人公司的人形服务机器人在国际机场完成为期一个月的全天候运营测试，累计服务旅客超5万人次，故障率低于1%。', '本周，某机器人公司宣布其人形服务机器人已在某国际机场完成为期30天的全天候真实运营测试。机器人在值机引导、行李搬运、多语言问询等岗位累计服务旅客超过5万人次，平均故障率低于1%。公司表示，下一代产品将重点提升灵巧手操作精度，并计划在更多交通枢纽部署。', '界面新闻', '2026-11-14 18:00:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=humanoid%20service%20robot%20in%20modern%20airport%20terminal%2C%20assisting%20travelers%2C%20tech%20news%20photography&image_size=landscape_16_9'),
('6G试验网完成外场验证，峰值速率达1Tbps', '多所高校与企业联合建设的6G试验网完成外场测试，实测峰值速率突破1Tbps，时延低至0.1毫秒，标准制定进入冲刺阶段。', '由国内多所高校与通信企业联合建设的6G太赫兹试验网本周完成外场验证。测试显示，在3公里视距范围内，系统实测峰值下载速率突破1Tbps，端到端时延低至0.1毫秒。项目组介绍，相关成果已提交国际电信联盟，6G标准制定预计于2027年前后冻结。', '人民邮电报', '2026-11-13 09:00:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=6g%20communication%20tower%20with%20holographic%20signal%20waves%2C%20futuristic%20city%2C%20tech%20news%20cover&image_size=landscape_16_9'),
('AI辅助药物研发再获突破：新分子进入二期临床', '利用生成式AI设计的全新小分子药物正式进入二期临床试验，研发周期从传统的四到六年缩短至十八个月。', '某生物医药企业宣布，由其AI药物研发平台设计的小分子抗纤维化药物已获批进入二期临床试验。该分子从立项到进入临床仅用时十八个月，远低于行业平均的四到六年。平台通过生成式模型与分子动力学模拟联合筛选，将候选化合物命中率提升了约五倍。', '财新网', '2026-11-12 15:30:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=scientific%20laboratory%20with%20AI%20drug%20molecule%20hologram%2C%20blue%20tones%2C%20medical%20technology%20news%20cover&image_size=landscape_16_9'),
('国产操作系统装机量突破十亿，生态适配加速', '国产桌面与移动操作系统累计装机量突破十亿台，主流应用适配率超过95%，政务与教育市场占有率持续提升。', '国产操作系统生态大会本周公布数据：国产桌面及移动操作系统累计装机量已突破十亿台，主流办公、社交与音视频应用适配率达到95%以上。相关负责人表示，明年将重点推进工业软件与专业设计软件的原生适配，并设立十亿元级开发者激励基金。', '中国电子报', '2026-11-11 11:45:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=desktop%20computer%20with%20abstract%20operating%20system%20interface%20glowing%2C%20technology%20news%20cover%2C%20clean%20modern&image_size=landscape_16_9'),
('深海载人潜水器完成万米级科考返航', '国产载人潜水器完成万米深渊科考任务顺利返航，带回超200份深渊生物与地质样本，多项观测数据为国际首次获取。', '历时52天，国产载人潜水器搭载科考船于本周返航，完成了马里亚纳海沟万米级深渊科考任务。本航次累计下潜23次，采集深渊生物、沉积物与岩石样本超过200份，并首次在国际上获取了万米深处连续72小时的环境观测数据，为深渊生命起源研究提供关键支撑。', '央视新闻', '2026-11-10 17:10:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=deep%20sea%20submersible%20descending%20in%20dark%20ocean%20with%20bioluminescent%20creatures%2C%20science%20news%20cover&image_size=landscape_16_9');

## 2026-11-20 建表 wzx_gallery 并插入测试数据

-- 在 wzx_web 库中执行
USE wzx_web;

-- 1. 建表 wzx_gallery（图文展示表）
CREATE TABLE IF NOT EXISTS wzx_gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT '标题',
  description VARCHAR(500) NOT NULL COMMENT '描述',
  img_url VARCHAR(500) NOT NULL COMMENT '图片地址',
  category VARCHAR(50) NOT NULL COMMENT '分类',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图文展示表';

-- 2. 插入 10 条图文测试数据
INSERT INTO wzx_gallery (title, description, img_url, category, create_time) VALUES
('95新无线降噪耳机', '自用一年的白色无线降噪耳机，音质出色，续航约30小时，配件齐全，附原装充电线与收纳袋。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20wireless%20noise%20cancelling%20headphones%20on%20clean%20desk%2C%20product%20photography%2C%20soft%20light&image_size=landscape_4_3', '数码', '2026-11-19 20:10:00'),
('机械键盘87键茶轴', '去年双十一入手的茶轴机械键盘，键帽无打油，白色背光，附赠拔键器，因换用 quieter 轴体故出售。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=compact%2087%20key%20mechanical%20keyboard%20with%20white%20keycaps%2C%20product%20photo%2C%20warm%20light&image_size=landscape_4_3', '数码', '2026-11-18 14:35:00'),
('高等数学同济版上下册', '大一大二用过的同济版高等数学教材，第八版，笔记较少，九成新，两本一起出，适合学弟学妹。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stack%20of%20used%20advanced%20mathematics%20textbooks%20on%20wooden%20desk%2C%20cozy%20campus%20light&image_size=landscape_4_3', '图书', '2026-11-17 09:50:00'),
('羽毛球拍单拍（碳纤维）', '碳纤维羽毛球拍，4U规格，手胶新换，拍框无磕碰，附原装拍套，因升级设备低价转让。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=badminton%20racket%20leaning%20on%20indoor%20court%20floor%2C%20sport%20product%20photography&image_size=landscape_4_3', '运动', '2026-11-16 18:25:00'),
('宿舍折叠书桌小推车', '宿舍神器折叠书桌，可放笔记本电脑和书籍，带滚轮方便移动，使用半年无明显划痕。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=folding%20laptop%20desk%20cart%20in%20dormitory%20room%2C%20minimal%20style%2C%20daylight&image_size=landscape_4_3', '生活', '2026-11-15 12:00:00'),
('山地自行车26寸', '骑行两年的26寸山地车，前后变速灵敏，刚换的新刹车片，已保养上油，附车锁与打气筒。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mountain%20bicycle%20parked%20beside%20campus%20path%20with%20trees%2C%20autumn%20light%2C%20realistic%20photo&image_size=landscape_4_3', '运动', '2026-11-14 16:45:00'),
('考研英语真题全套', '考研英语一历年真题解析全套（近15年），做完一半，批注集中在阅读部分，书况良好。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=postgraduate%20entrance%20exam%20english%20workbooks%20with%20sticky%20notes%2C%20study%20desk%2C%20soft%20morning%20light&image_size=landscape_4_3', '图书', '2026-11-13 10:30:00'),
('平板电脑11英寸128G', '11英寸平板电脑，128G存储，屏幕无划痕，贴膜带壳使用，附保护壳与手写笔，用于网课和记笔记。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tablet%20with%20stylus%20pen%20on%20study%20desk%20with%20notebooks%2C%20product%20photography%2C%20clean%20background&image_size=landscape_4_3', '数码', '2026-11-12 19:20:00'),
('篮球耐磨室外款', '室外水泥地专用耐磨篮球，七号球，气性良好，表皮轻微磨痕不影响使用，附球包。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20on%20outdoor%20court%20at%20golden%20hour%2C%20sport%20photography%2C%20realistic&image_size=landscape_4_3', '运动', '2026-11-11 15:10:00'),
('小型加湿器白瓷款', '宿舍用白瓷小加湿器，静音雾量大，容量2L，可用整晚，因搬宿舍出售，配件全新。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20ceramic%20mini%20humidifier%20with%20soft%20mist%20in%20cozy%20bedroom%2C%20lifestyle%20product%20photo&image_size=landscape_4_3', '生活', '2026-11-10 11:40:00');

## 2026-11-20 修正 wzx_gallery 图片地址（在线图片生成服务异常，改用本地封面图）

-- 说明：在线图片生成服务持续返回"生成中"占位图，无法出图，
-- 已在 frontend/images/ 下生成 10 张本地 SVG 封面图（wzx_gallery_01.svg ~ wzx_gallery_10.svg），
-- 并将 img_url 更新为本地路径。以下 UPDATE 在 wzx_web 库中按顺序执行。

USE wzx_web;

UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_01.svg' WHERE id = 1;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_02.svg' WHERE id = 2;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_03.svg' WHERE id = 3;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_04.svg' WHERE id = 4;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_05.svg' WHERE id = 5;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_06.svg' WHERE id = 6;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_07.svg' WHERE id = 7;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_08.svg' WHERE id = 8;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_09.svg' WHERE id = 9;
UPDATE wzx_gallery SET img_url = '/images/wzx_gallery_10.svg' WHERE id = 10;

## 2026-11-20 再次修正 wzx_gallery 图片：删除 SVG 封面，更换为写实风格 JPG 图片

-- 说明：应要求更换为更贴近现实的图片。已用 AI 图片生成工具生成 10 张写实产品/场景照片，
-- 保存为 frontend/images/wzx_gallery_01.jpg ~ wzx_gallery_10.jpg（4:3 横图），
-- 原 10 张 SVG 封面已删除。以下 UPDATE 在 wzx_web 库中执行。

USE wzx_web;

UPDATE wzx_gallery SET img_url = REPLACE(img_url, '.svg', '.jpg') WHERE img_url LIKE '/images/wzx_gallery_%.svg';
-- 执行后各条 img_url 为 /images/wzx_gallery_01.jpg ~ /images/wzx_gallery_10.jpg

## 2026-11-25 新建在线客服聊天记录表 wzx_chat_message

-- 说明：为 AI 在线客服功能新建聊天记录表，保存用户与客服 AI 的对话。
-- 以下 SQL 在 wzx_web 库中按顺序执行。

USE wzx_web;

CREATE TABLE IF NOT EXISTS wzx_chat_message (
  wzx_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
  wzx_session_id VARCHAR(64) NOT NULL COMMENT '会话ID',
  wzx_role VARCHAR(20) NOT NULL COMMENT '角色：user/assistant',
  wzx_content TEXT NOT NULL COMMENT '消息内容',
  wzx_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  INDEX idx_wzx_session (wzx_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='在线客服聊天记录表';

INSERT INTO wzx_chat_message (wzx_session_id, wzx_role, wzx_content, wzx_create_time) VALUES
('wzx_demo_session', 'user', '你好，你们平台是做什么的？', '2026-11-20 10:00:00'),
('wzx_demo_session', 'assistant', '您好！我是拾光集市在线客服。拾光集市是校园二手交易平台，可以在这里发布和购买二手数码、图书、运动用品等，欢迎体验！', '2026-11-20 10:00:05'),
('wzx_demo_session', 'user', '在你们平台卖东西怎么定价？', '2026-11-20 10:01:00'),
('wzx_demo_session', 'assistant', '建议根据物品成色和使用时长定价，一般为原价的3-6折。可以在商品描述里写清楚使用情况和瑕疵，更容易成交哦。', '2026-11-20 10:01:06'),
('wzx_demo_session', 'user', '买二手耳机要注意什么？', '2026-11-20 10:02:00'),
('wzx_demo_session', 'assistant', '建议先确认耳机功能正常、配件齐全，尽量选择当面交易验货，检查音质、降噪和续航是否与描述一致。', '2026-11-20 10:02:07'),
('wzx_demo_session', 'user', '怎么联系卖家？', '2026-11-20 10:03:00'),
('wzx_demo_session', 'assistant', '在商品页面点击"联系卖家"，即可与卖家在线沟通，约定看货和交易时间。祝您购物愉快！', '2026-11-20 10:03:05');

