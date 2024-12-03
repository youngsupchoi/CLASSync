interface Section {
  title: string;
  items: {
    content: string;
    isHighlighted?: boolean;
  }[];
}

interface Chapter {
  id: string;
  title: string;
  sections: {
    id: string;
    title: string;
    items: {
      content: string;
      isHighlighted?: boolean;
    }[];
  }[];
}

interface SummarySectionProps {
  data: Chapter[];
}

const SummarySection = ({ data }: SummarySectionProps) => {
  return (
    <div className="space-y-8">
      {data.map((chapter) => (
        <div key={chapter.id} className="mb-8">
          <h2 className="mb-6 text-xl font-bold">{chapter.title}</h2>
          {chapter.sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {item.isHighlighted ? (
                      <span className="mt-1 text-yellow-400">★</span>
                    ) : (
                      <span className="mt-1 text-gray-400">○</span>
                    )}
                    <span>{item.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SummarySection;

const data = [
  {
    id: 1,
    title: "1. 소프트웨어와 하드웨어의 인터페이스와 그 활용",
    order_num: 1,
    created_at: "2024-03-15T12:00:00.000Z",
    updated_at: "2024-03-15T12:00:00.000Z",
    sections: [
      {
        id: 1,
        chapter_id: 1,
        title: "1-1. 소프트웨어와 하드웨어의 인터페이스 개념 이해",
        order_num: 1,
        created_at: "2024-03-15T12:00:00.000Z",
        updated_at: "2024-03-15T12:00:00.000Z",
        items: [
          {
            id: 1,
            section_id: 1,
            content:
              "소프트웨어와 하드웨어 사이에 존재하는 인터페이스를 인스트럭션 아키텍처라고 함",
            is_highlighted: false,
            order_num: 1,
            created_at: "2024-03-15T12:00:00.000Z",
            updated_at: "2024-03-15T12:00:00.000Z",
          },
          {
            id: 2,
            section_id: 1,
            content:
              "인스트럭션 아키텍처는 명령어 집합 구조를 통해 하드웨어와 소프트웨어의 소통을 가능하게 함",
            is_highlighted: true,
            order_num: 2,
            created_at: "2024-03-15T12:00:00.000Z",
            updated_at: "2024-03-15T12:00:00.000Z",
          },
        ],
      },
    ],
  },
];
