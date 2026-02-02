import { Card } from "../ui/card";

interface CategorySectionProps {
  onCategoryClick?: (category: string) => void;
}

const categories = [
  { id: 1, name: "Men", slug: "men", icon: "👔" },
  { id: 2, name: "Women", slug: "women", icon: "👗" },
  { id: 3, name: "Accessories", slug: "accessories", icon: "👜" },
  { id: 4, name: "Shoes", slug: "shoes", icon: "👞" },
];

export default function CategorySection({
  onCategoryClick,
}: CategorySectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-light mb-12 text-center text-foreground">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category.slug)}
              className="w-full"
            >
              <Card className="h-40 flex flex-col items-center justify-center bg-card hover:bg-secondary transition cursor-pointer p-4">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="text-center font-medium text-card-foreground">
                  {category.name}
                </h3>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
