import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Props {
  onSelect: (id: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <button
        onClick={onBack}
        className="mb-6 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900">Choose your buzzword pack</h1>
      <p className="mt-1 text-gray-600">Each card draws 24 random words from the pack.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card key={category.id} className="flex flex-col p-5 text-left">
            <div className="text-3xl" aria-hidden="true">
              {category.icon}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">{category.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{category.description}</p>

            <p className="mt-3 text-xs text-gray-400">
              e.g. {category.words.slice(0, 3).join(', ')}…
            </p>

            <Button
              className="mt-4"
              onClick={() => onSelect(category.id)}
              aria-label={`Play ${category.name}`}
            >
              Play
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
