interface PreviewContentProps {
  content: string;
}

export function PreviewContent({ content }: PreviewContentProps) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Contenu extrait :</h3>
      <div className="max-h-48 overflow-y-auto bg-muted p-2 rounded-md">
        <pre className="text-xs whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
}
