export interface VocabWord {
  id: string;
  h: string;
  p: string;
  m: string;
  audioClip: string;
  fullAudioStart: number;
  fullAudioEnd: number;
  ex: [string, string][];
  isProperNoun?: boolean;
}

export interface DialogueLine {
  id: string;
  role: string;
  speakerName: string;
  zh: string;
  py: string;
  vn: string;
  start: number;
  end: number;
  clip: string;
}

export interface DialogueSection {
  id: string;
  title: string;
  subTitle: string;
  fullAudio: string;
  lines: DialogueLine[];
}

export const VOCAB_WORDS: VocabWord[] = [
  {
    id: 'mishu',
    h: '秘书',
    p: 'mìshū',
    m: 'thư ký',
    audioClip: '/audio/vocab/mishu.mp3',
    fullAudioStart: 6.80,
    fullAudioEnd: 7.70,
    ex: [
      ['她是我的秘书。', 'Cô ấy là thư ký của tôi.'],
      ['秘书在办公室。', 'Thư ký ở trong văn phòng.'],
      ['王秘书很忙。', 'Thư ký Vương rất bận.']
    ]
  },
  {
    id: 'xian',
    h: '先',
    p: 'xiān',
    m: 'trước (tiên)',
    audioClip: '/audio/vocab/xian.mp3',
    fullAudioStart: 9.00,
    fullAudioEnd: 9.70,
    ex: [
      ['你先走。', 'Bạn đi trước đi.'],
      ['我先吃饭。', 'Tôi ăn cơm trước.'],
      ['你先介绍一下。', 'Bạn giới thiệu trước đi.']
    ]
  },
  {
    id: 'jieshao',
    h: '介绍',
    p: 'jièshào',
    m: 'giới thiệu',
    audioClip: '/audio/vocab/jieshao.mp3',
    fullAudioStart: 11.00,
    fullAudioEnd: 11.90,
    ex: [
      ['我介绍一下。', 'Tôi giới thiệu một chút.'],
      ['这是介绍信。', 'Đây là thư giới thiệu.'],
      ['我先介绍一下。', 'Tôi giới thiệu trước nhé.']
    ]
  },
  {
    id: 'yixiar',
    h: '一下儿',
    p: 'yíxiàr',
    m: 'một chút (hành động ngắn)',
    audioClip: '/audio/vocab/yixiar.mp3',
    fullAudioStart: 13.15,
    fullAudioEnd: 14.05,
    ex: [
      ['你等一下儿。', 'Bạn đợi một chút.'],
      ['我看一下儿。', 'Tôi xem một chút.'],
      ['我试一下儿。', 'Tôi thử một chút.']
    ]
  },
  {
    id: 'xiaozhang',
    h: '校长',
    p: 'xiàozhǎng',
    m: 'hiệu trưởng',
    audioClip: '/audio/vocab/xiaozhang.mp3',
    fullAudioStart: 15.55,
    fullAudioEnd: 16.60,
    ex: [
      ['马校长来了。', 'Hiệu trưởng Mã đến rồi.'],
      ['校长在开会。', 'Hiệu trưởng đang họp.'],
      ['这是我们校长。', 'Đây là hiệu trưởng của chúng tôi.']
    ]
  },
  {
    id: 'wei',
    h: '位',
    p: 'wèi',
    m: 'vị (lượng từ tôn kính cho người)',
    audioClip: '/audio/vocab/wei.mp3',
    fullAudioStart: 17.85,
    fullAudioEnd: 18.35,
    ex: [
      ['这位是王教授。', 'Vị này là Giáo sư Vương.'],
      ['那位女士是谁？', 'Vị nữ sĩ kia là ai?'],
      ['两位老师好。', 'Chào hai thầy cô.']
    ]
  },
  {
    id: 'jiaoshou',
    h: '教授',
    p: 'jiàoshòu',
    m: 'giáo sư',
    audioClip: '/audio/vocab/jiaoshou.mp3',
    fullAudioStart: 19.70,
    fullAudioEnd: 20.65,
    ex: [
      ['王教授很忙。', 'Giáo sư Vương rất bận.'],
      ['他是大学教授。', 'Ông ấy là giáo sư đại học.'],
      ['谢谢王教授。', 'Cảm ơn Giáo sư Vương.']
    ]
  },
  {
    id: 'huanying',
    h: '欢迎',
    p: 'huānyíng',
    m: 'hoan nghênh, chào đón',
    audioClip: '/audio/vocab/huanying.mp3',
    fullAudioStart: 22.05,
    fullAudioEnd: 23.05,
    ex: [
      ['欢迎您！', 'Hoan nghênh ngài!'],
      ['欢迎来我家。', 'Hoan nghênh đến nhà tôi.'],
      ['欢迎新同学。', 'Chào mừng học sinh mới.']
    ]
  },
  {
    id: 'liuxuesheng',
    h: '留学生',
    p: 'liúxuéshēng',
    m: 'lưu học sinh (du học sinh)',
    audioClip: '/audio/vocab/liuxuesheng.mp3',
    fullAudioStart: 24.35,
    fullAudioEnd: 25.75,
    ex: [
      ['你是留学生吗？', 'Bạn là lưu học sinh phải không?'],
      ['我们班有十个留学生。', 'Lớp chúng tôi có mười lưu học sinh.'],
      ['他是美国留学生。', 'Anh ấy là lưu học sinh Mỹ.']
    ]
  },
  {
    id: 'liuxue',
    h: '留学',
    p: 'liúxué',
    m: 'du học',
    audioClip: '/audio/vocab/liuxue.mp3',
    fullAudioStart: 27.10,
    fullAudioEnd: 28.15,
    ex: [
      ['他在中国留学。', 'Anh ấy du học ở Trung Quốc.'],
      ['我想去北京留学。', 'Tôi muốn đi Bắc Kinh du học.']
    ]
  },
  {
    id: 'women',
    h: '我们',
    p: 'wǒmen',
    m: 'chúng tôi, chúng ta',
    audioClip: '/audio/vocab/women.mp3',
    fullAudioStart: 29.40,
    fullAudioEnd: 30.30,
    ex: [
      ['我们都是学生。', 'Chúng tôi đều là học sinh.'],
      ['我们去上课。', 'Chúng tôi đi học.'],
      ['这是我们的老师。', 'Đây là giáo viên của chúng tôi.']
    ]
  },
  {
    id: 'nimen',
    h: '你们',
    p: 'nǐmen',
    m: 'các bạn',
    audioClip: '/audio/vocab/nimen.mp3',
    fullAudioStart: 31.50,
    fullAudioEnd: 32.50,
    ex: [
      ['你们好吗？', 'Các bạn khỏe không?'],
      ['你们去哪儿？', 'Các bạn đi đâu?'],
      ['你们是留学生吗？', 'Các bạn là lưu học sinh phải không?']
    ]
  },
  {
    id: 'tamen',
    h: '他们',
    p: 'tāmen',
    m: 'họ (nam hoặc chung)',
    audioClip: '/audio/vocab/tamen.mp3',
    fullAudioStart: 33.80,
    fullAudioEnd: 34.70,
    ex: [
      ['他们是中国人。', 'Họ là người Trung Quốc.'],
      ['他们是老师。', 'Họ là giáo viên.'],
      ['他们都是我的朋友。', 'Họ đều là bạn của tôi.']
    ]
  },
  {
    id: 'dou',
    h: '都',
    p: 'dōu',
    m: 'đều',
    audioClip: '/audio/vocab/dou.mp3',
    fullAudioStart: 36.00,
    fullAudioEnd: 36.60,
    ex: [
      ['我们都去。', 'Chúng tôi đều đi.'],
      ['他们都是学生。', 'Họ đều là học sinh.'],
      ['我们都是留学生。', 'Chúng tôi đều là lưu học sinh.']
    ]
  },
  {
    id: 'he',
    h: '和',
    p: 'hé',
    m: 'và, cùng',
    audioClip: '/audio/vocab/he.mp3',
    fullAudioStart: 38.00,
    fullAudioEnd: 38.75,
    ex: [
      ['我和你。', 'Tôi và bạn.'],
      ['苹果和香蕉。', 'Táo và chuối.'],
      ['张东和田芳。', 'Trương Đông và Điền Phương.']
    ]
  },
  {
    id: 'lia',
    h: '俩',
    p: 'liǎ',
    m: 'hai (người)',
    audioClip: '/audio/vocab/lia.mp3',
    fullAudioStart: 40.05,
    fullAudioEnd: 41.00,
    ex: [
      ['他们俩是朋友。', 'Hai người họ là bạn.'],
      ['我们俩一起走。', 'Hai chúng tôi đi cùng nhau.'],
      ['他们俩都是老师。', 'Cả hai người họ đều là giáo viên.']
    ]
  },
  {
    id: 'xuesheng',
    h: '学生',
    p: 'xuésheng',
    m: 'học sinh, sinh viên',
    audioClip: '/audio/vocab/xuesheng.mp3',
    fullAudioStart: 42.25,
    fullAudioEnd: 43.25,
    ex: [
      ['他是学生。', 'Anh ấy là học sinh.'],
      ['我是中国学生。', 'Tôi là học sinh Trung Quốc.'],
      ['学生们在看书。', 'Các học sinh đang đọc sách.']
    ]
  },
  {
    id: 'meishenme',
    h: '没什么',
    p: 'méi shénme',
    m: 'không có gì, không sao',
    audioClip: '/audio/vocab/meishenme.mp3',
    fullAudioStart: 44.70,
    fullAudioEnd: 45.95,
    ex: [
      ['对不起。——没什么。', 'Xin lỗi. —— Không có gì.'],
      ['没什么事。', 'Không có việc gì.'],
      ['没什么大不了的。', 'Không có gì to tát cả.']
    ]
  },
  // Proper Nouns (专名)
  {
    id: 'ma',
    h: '马',
    p: 'Mǎ',
    m: 'họ Mã (Mã hiệu trưởng)',
    audioClip: '/audio/vocab/ma.mp3',
    fullAudioStart: 52.40,
    fullAudioEnd: 53.10,
    isProperNoun: true,
    ex: [
      ['这是马校长。', 'Đây là Hiệu trưởng Mã.']
    ]
  },
  {
    id: 'tianfang',
    h: '田芳',
    p: 'Tián Fāng',
    m: 'Điền Phương (tên riêng)',
    audioClip: '/audio/vocab/tianfang.mp3',
    fullAudioStart: 54.40,
    fullAudioEnd: 55.40,
    isProperNoun: true,
    ex: [
      ['田芳是中国学生。', 'Điền Phương là học sinh Trung Quốc.']
    ]
  },
  {
    id: 'luolan',
    h: '罗兰',
    p: 'Luólán',
    m: 'La Lan (Roland - tên riêng)',
    audioClip: '/audio/vocab/luolan.mp3',
    fullAudioStart: 56.55,
    fullAudioEnd: 57.60,
    isProperNoun: true,
    ex: [
      ['罗兰也是留学生。', 'La Lan cũng là lưu học sinh.']
    ]
  },
  {
    id: 'aidehua',
    h: '爱德华',
    p: 'Àidéhuá',
    m: 'Edward (Ái Đức Hoa - tên riêng)',
    audioClip: '/audio/vocab/aidehua.mp3',
    fullAudioStart: 58.95,
    fullAudioEnd: 60.25,
    isProperNoun: true,
    ex: [
      ['爱德华是我的朋友。', 'Edward là bạn của tôi.']
    ]
  }
];

export const DIALOGUE_SECTIONS: DialogueSection[] = [
  {
    id: 'dlg_sec_1',
    title: '一、这位是王教授',
    subTitle: '秘书给校长介绍王教授 (Thư ký giới thiệu Giáo sư Vương với Hiệu trưởng)',
    fullAudio: '/assets/aistudio/11-1_897822e8.mp3',
    lines: [
      {
        id: 'dlg_0',
        role: 'C',
        speakerName: '秘书 (Thư ký)',
        zh: '我先介绍一下儿，这是马校长，这位是王教授。',
        py: 'Wǒ xiān jièshào yíxiàr, zhè shì Mǎ xiàozhǎng, zhè wèi shì Wáng jiàoshòu.',
        vn: 'Tôi xin giới thiệu một chút, đây là Hiệu trưởng Mã, vị này là Giáo sư Vương.',
        start: 26.65,
        end: 33.55,
        clip: '/audio/dialogue/dlg_0.mp3'
      },
      {
        id: 'dlg_1',
        role: 'A',
        speakerName: '马校长 (Hiệu trưởng Mã)',
        zh: '欢迎您，王教授。',
        py: 'Huānyíng nín, Wáng jiàoshòu.',
        vn: 'Hoan nghênh ngài, Giáo sư Vương.',
        start: 34.65,
        end: 36.35,
        clip: '/audio/dialogue/dlg_1.mp3'
      },
      {
        id: 'dlg_2',
        role: 'B',
        speakerName: '王教授 (Giáo sư Vương)',
        zh: '谢谢！',
        py: 'Xièxie!',
        vn: 'Cảm ơn!',
        start: 37.40,
        end: 38.40,
        clip: '/audio/dialogue/dlg_2.mp3'
      }
    ]
  },
  {
    id: 'dlg_sec_2',
    title: '二、我们都是留学生',
    subTitle: 'Hỏi về quốc tịch và tư cách lưu học sinh',
    fullAudio: '/assets/aistudio/11-2_4d4cb194.mp3',
    lines: [
      {
        id: 'dlg_3',
        role: 'A',
        speakerName: 'A (Người hỏi)',
        zh: '你是留学生吗？',
        py: 'Nǐ shì liúxuéshēng ma?',
        vn: 'Bạn là lưu học sinh phải không?',
        start: 7.45,
        end: 9.40,
        clip: '/audio/dialogue/dlg_3.mp3'
      },
      {
        id: 'dlg_4',
        role: 'B',
        speakerName: 'B (Bạn học)',
        zh: '是。',
        py: 'Shì.',
        vn: 'Đúng vậy.',
        start: 10.10,
        end: 10.75,
        clip: '/audio/dialogue/dlg_4.mp3'
      },
      {
        id: 'dlg_5',
        role: 'A',
        speakerName: 'A (Người hỏi)',
        zh: '罗兰也是留学生吗？',
        py: 'Luólán yě shì liúxuéshēng ma?',
        vn: 'La Lan cũng là lưu học sinh phải không?',
        start: 11.95,
        end: 14.60,
        clip: '/audio/dialogue/dlg_5.mp3'
      },
      {
        id: 'dlg_6',
        role: 'B',
        speakerName: 'B (Bạn học)',
        zh: '她也是留学生。我们都是留学生。',
        py: 'Tā yě shì liúxuéshēng. Wǒmen dōu shì liúxuéshēng.',
        vn: 'Cô ấy cũng là lưu học sinh. Chúng tôi đều là lưu học sinh.',
        start: 15.65,
        end: 21.20,
        clip: '/audio/dialogue/dlg_6.mp3'
      },
      {
        id: 'dlg_7',
        role: 'A',
        speakerName: 'A (Người hỏi)',
        zh: '张东和田芳也都是留学生吗？',
        py: 'Zhāng Dōng hé Tián Fāng yě dōu shì liúxuéshēng ma?',
        vn: 'Trương Đông và Điền Phương cũng đều là lưu học sinh phải không?',
        start: 22.25,
        end: 26.50,
        clip: '/audio/dialogue/dlg_7.mp3'
      },
      {
        id: 'dlg_8',
        role: 'B',
        speakerName: 'B (Bạn học)',
        zh: '不，他们俩不是留学生。他们都是中国学生。',
        py: 'Bù, tāmen liǎ bú shì liúxuéshēng. Tāmen dōu shì Zhōngguó xuésheng.',
        vn: 'Không, hai người họ không phải lưu học sinh. Họ đều là học sinh Trung Quốc.',
        start: 27.55,
        end: 34.70,
        clip: '/audio/dialogue/dlg_8.mp3'
      }
    ]
  },
  {
    id: 'dlg_sec_3',
    title: '三、你也是中国人吗？',
    subTitle: 'Hỏi về quốc tịch và lời xin lỗi',
    fullAudio: '/assets/aistudio/11-3_497c02d4.mp3',
    lines: [
      {
        id: 'dlg_9',
        role: 'A',
        speakerName: 'A (Người hỏi)',
        zh: '他是中国人吗？',
        py: 'Tā shì Zhōngguó rén ma?',
        vn: 'Anh ấy là người Trung Quốc phải không?',
        start: 7.50,
        end: 9.40,
        clip: '/audio/dialogue/dlg_9.mp3'
      },
      {
        id: 'dlg_10',
        role: 'B',
        speakerName: 'B (Người trả lời)',
        zh: '是。',
        py: 'Shì.',
        vn: 'Đúng vậy.',
        start: 10.50,
        end: 11.15,
        clip: '/audio/dialogue/dlg_10.mp3'
      },
      {
        id: 'dlg_11',
        role: 'A',
        speakerName: 'A (Người hỏi)',
        zh: '你也是中国人吗？',
        py: 'Nǐ yě shì Zhōngguó rén ma?',
        vn: 'Bạn cũng là người Trung Quốc phải không?',
        start: 12.55,
        end: 14.80,
        clip: '/audio/dialogue/dlg_11.mp3'
      },
      {
        id: 'dlg_12',
        role: 'B',
        speakerName: 'B (Người trả lời)',
        zh: '不是。我是韩国人。',
        py: 'Bú shì. Wǒ shì Hánguó rén.',
        vn: 'Không phải. Tôi là người Hàn Quốc.',
        start: 15.90,
        end: 18.90,
        clip: '/audio/dialogue/dlg_12.mp3'
      },
      {
        id: 'dlg_13',
        role: 'A',
        speakerName: 'A (Người xin lỗi)',
        zh: '对不起。',
        py: 'Duìbuqǐ.',
        vn: 'Xin lỗi.',
        start: 20.55,
        end: 21.35,
        clip: '/audio/dialogue/dlg_13.mp3'
      },
      {
        id: 'dlg_14',
        role: 'B',
        speakerName: 'B (Người đáp)',
        zh: '没什么。',
        py: 'Méi shénme.',
        vn: 'Không có gì.',
        start: 22.50,
        end: 23.45,
        clip: '/audio/dialogue/dlg_14.mp3'
      }
    ]
  }
];

export const GRAMMAR_DATA = [
  {
    title: '1. Động từ + 一下儿 (yíxiàr)',
    formula: 'Động từ + 一下儿',
    desc: 'Dùng khi muốn diễn tả một HÀNH ĐỘNG làm nhanh, ngắn, thời gian ngắn hoặc có ý nghĩa thử làm ("một chút / một lát").',
    ex: [
      { zh: '你等一下儿。', py: 'Nǐ děng yíxiàr.', vn: 'Bạn đợi một chút.' },
      { zh: '我看一下儿。', py: 'Wǒ kàn yíxiàr.', vn: 'Tôi xem một chút.' },
      { zh: '我试一下儿。', py: 'Wǒ shì yíxiàr.', vn: 'Tôi thử một chút.' },
      { zh: '我先介绍一下儿。', py: 'Wǒ xiān jièshào yíxiàr.', vn: 'Tôi xin giới thiệu một chút.' }
    ]
  },
  {
    title: '2. 一会儿 (yíhuìr) - Một lát / Khoảng thời gian ngắn',
    formula: 'Vị trí linh hoạt (đầu câu / trước / sau động từ)',
    desc: 'Dùng khi muốn nói một KHOẢNG THỜI GIAN ngắn. Thường chỉ thời gian trôi qua một lúc.',
    ex: [
      { zh: '一会儿见。', py: 'Yíhuìr jiàn.', vn: 'Lát nữa gặp nhé.' },
      { zh: '我一会儿给你打电话。', py: 'Wǒ yíhuìr gěi nǐ dǎ diànhuà.', vn: 'Lát nữa tôi gọi cho bạn.' },
      { zh: '再等一会儿。', py: 'Zài děng yíhuìr.', vn: 'Đợi thêm một lát.' }
    ]
  },
  {
    title: '3. Phân biệt 一下儿 và 一会儿',
    formula: '一下儿 (Bổ ngữ động lượng) vs 一会儿 (Danh từ chỉ thời gian)',
    desc: 'So sánh trực tiếp vị trí, cấu trúc và sắc thái biểu đạt giữa 一下儿 (hành động nhanh, ngắn) và 一会儿 (khoảng thời gian).',
    ex: [
      { zh: '我问一下儿老师。', py: 'Wǒ wèn yíxiàr lǎoshī.', vn: 'Tôi hỏi giáo viên một chút.' },
      { zh: '我要学习一会儿。', py: 'Wǒ yào xuéxí yíhuìr.', vn: 'Tôi muốn học một lát.' },
      { zh: '请你等一下儿。', py: 'Qǐng nǐ děng yíxiàr.', vn: 'Xin bạn đợi một chút.' },
      { zh: '请你等一会儿。', py: 'Qǐng nǐ děng yíhuìr.', vn: 'Xin bạn đợi một lát.' }
    ]
  },
  {
    title: '4. 先……，然后…… (Trước..., sau đó...)',
    formula: '先 + [hành động 1] +，然后 + [hành động 2]',
    desc: 'Biểu thị thứ tự liên tiếp: làm việc gì đó trước, sau đó tiếp tục làm việc khác.',
    ex: [
      { zh: '我先吃饭，然后做作业。', py: 'Wǒ xiān chīfàn, ránhòu zuò zuòyè.', vn: 'Tôi ăn cơm trước, sau đó làm bài tập.' },
      { zh: '你先洗手，然后吃饭。', py: 'Nǐ xiān xǐshǒu, ránhòu chīfàn.', vn: 'Bạn rửa tay trước, rồi ăn cơm.' },
      { zh: '我们先去银行，然后去超市。', py: 'Wǒmen xiān qù yínháng, ránhòu qù chāoshì.', vn: 'Chúng ta đi ngân hàng trước, rồi đi siêu thị.' }
    ]
  },
  {
    title: '5. Phó từ 也 (cũng) và 都 (đều)',
    formula: 'Chủ ngữ + 也 + 都 + Động từ/Tính từ',
    desc: 'Khi cả 也 và 都 cùng xuất hiện trong một câu, 也 luôn đứng TRƯỚC 都.',
    ex: [
      { zh: '我们都是留学生。', py: 'Wǒmen dōu shì liúxuéshēng.', vn: 'Chúng tôi đều là lưu học sinh.' },
      { zh: '他们也都是中国学生。', py: 'Tāmen yě dōu shì Zhōngguó xuésheng.', vn: 'Họ cũng đều là học sinh Trung Quốc.' },
      { zh: '他们俩不是留学生。', py: 'Tāmen liǎ bú shì liúxuéshēng.', vn: 'Hai người họ không phải lưu học sinh.' }
    ]
  }
];

export const EX1_DATA = [
  {
    text: '我 ___ 介绍一下儿，这是马校长。',
    py: 'Wǒ ___ jièshào yíxiàr, zhè shì Mǎ xiàozhǎng.',
    ans: '先',
    opt: ['先', '然后', '和', '都']
  },
  {
    text: '你先等一 ___ ，我马上来。',
    py: 'Nǐ xiān děng yí ___ , wǒ mǎshàng lái.',
    ans: '下儿',
    opt: ['下儿', '会儿', '点', '些']
  },
  {
    text: '张东和田芳也 ___ 是留学生吗？',
    py: 'Zhāng Dōng hé Tián Fāng yě ___ shì liúxuéshēng ma?',
    ans: '都',
    opt: ['都', '也', '不', '没']
  },
  {
    text: '不，他们 ___ 不是留学生。',
    py: 'Bù, tāmen ___ bú shì liúxuéshēng.',
    ans: '俩',
    opt: ['俩', '两', '个', '位']
  },
  {
    text: '对不起。—— ___ 。',
    py: 'Duìbuqǐ. —— ___ .',
    ans: '没什么',
    opt: ['没什么', '不客气', '再见', '谢谢你']
  }
];

export const EX2_DATA = [
  {
    q: '我先介绍一下儿，这是马校长，这 ___ 是王教授。',
    py: 'Wǒ xiān jièshào yíxiàr, zhè shì Mǎ xiàozhǎng, zhè ___ shì Wáng jiàoshòu.',
    opts: [
      { t: '位', p: 'wèi' },
      { t: '个', p: 'gè' },
      { t: '名', p: 'míng' },
      { t: '只', p: 'zhī' }
    ],
    ans: 0
  },
  {
    q: '你也是中国人 ___ ？',
    py: 'Nǐ yě shì Zhōngguó rén ___ ?',
    opts: [
      { t: '吗', p: 'ma' },
      { t: '呢', p: 'ne' },
      { t: '吧', p: 'ba' },
      { t: '的', p: 'de' }
    ],
    ans: 0
  },
  {
    q: '你先等一下 ___ ，我马上来。',
    py: 'Nǐ xiān děng yí ___ , wǒ mǎshàng lái.',
    opts: [
      { t: '下儿', p: 'xiàr' },
      { t: '会儿', p: 'huìr' },
      { t: '点', p: 'diǎn' },
      { t: '些', p: 'xiē' }
    ],
    ans: 0
  },
  {
    q: '他们 ___ 不是留学生，他们是中国人。',
    py: 'Tāmen ___ bú shì liúxuéshēng, tāmen shì Zhōngguó rén.',
    opts: [
      { t: '俩', p: 'liǎ' },
      { t: '两', p: 'liǎng' },
      { t: '都', p: 'dōu' },
      { t: '也', p: 'yě' }
    ],
    ans: 0
  },
  {
    q: '对不起。—— ___ 。',
    py: 'Duìbuqǐ. —— ___ .',
    opts: [
      { t: '没什么', p: 'méi shénme' },
      { t: '不客气', p: 'bú kèqi' },
      { t: '再见', p: 'zàijiàn' },
      { t: '谢谢', p: 'xièxie' }
    ],
    ans: 0
  }
];

export const EX3_DATA = [
  {
    words: [
      { t: '我先', p: 'Wǒ xiān' },
      { t: '介绍一下儿', p: 'jièshào yíxiàr' },
      { t: '马校长', p: 'Mǎ xiàozhǎng' },
      { t: '。', p: '' }
    ],
    ans: ['我先介绍一下儿马校长。'],
    hint: 'Tôi xin giới thiệu một chút Hiệu trưởng Mã.'
  },
  {
    words: [
      { t: '你', p: 'Nǐ' },
      { t: '是', p: 'shì' },
      { t: '留学生', p: 'liúxuéshēng' },
      { t: '吗', p: 'ma' },
      { t: '？', p: '' }
    ],
    ans: ['你是留学生吗？'],
    hint: 'Bạn là lưu học sinh phải không?'
  },
  {
    words: [
      { t: '他们俩', p: 'Tāmen liǎ' },
      { t: '不是', p: 'bú shì' },
      { t: '留学生', p: 'liúxuéshēng' },
      { t: '。', p: '' }
    ],
    ans: ['他们俩不是留学生。'],
    hint: 'Hai người họ không phải lưu học sinh.'
  },
  {
    words: [
      { t: '我们', p: 'Wǒmen' },
      { t: '先', p: 'xiān' },
      { t: '吃饭', p: 'chīfàn' },
      { t: '，', p: '' },
      { t: '然后', p: 'ránhòu' },
      { t: '做作业', p: 'zuò zuòyè' }
    ],
    ans: ['我们先吃饭，然后做作业'],
    hint: 'Chúng ta ăn cơm trước, sau đó làm bài tập.'
  },
  {
    words: [
      { t: '我', p: 'Wǒ' },
      { t: '一会儿', p: 'yíhuìr' },
      { t: '给你', p: 'gěi nǐ' },
      { t: '打电话', p: 'dǎ diànhuà' },
      { t: '。', p: '' }
    ],
    ans: ['我一会儿给你打电话。'],
    hint: 'Lát nữa tôi gọi cho bạn.'
  }
];
