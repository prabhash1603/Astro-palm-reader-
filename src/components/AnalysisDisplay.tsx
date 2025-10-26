import React from 'react';
import { marked } from 'marked';

interface AnalysisDisplayProps {
    content: string;
}

const AnalysisSection: React.FC<{ title: string; content: string; delay: number }> = ({ title, content, delay }) => {
    if (!content.trim()) return null;
    const parsedHtml = marked.parse(content);
    
    return (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 animate-fade-in mb-6 border border-purple-500/30" style={{ animationDelay: `${delay}ms` }}>
            <h3 className="text-2xl font-bold text-purple-300 mb-3 border-b-2 border-purple-700 pb-2">
                {title}
            </h3>
            <div
                className="prose prose-invert max-w-none prose-ul:list-disc prose-ul:list-inside prose-ul:space-y-2 prose-li:ml-4"
                dangerouslySetInnerHTML={{ __html: parsedHtml as string }}
            />
        </div>
    );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ content }) => {
    const disclaimerRegex = /^\s*Disclaimer:.*$/im;
    const disclaimerMatch = content.match(disclaimerRegex);
    
    const mainContent = content.replace(disclaimerRegex, '').trim();
    const disclaimer = disclaimerMatch ? disclaimerMatch[0] : '';

    const sections = mainContent.split('### ').filter(Boolean).map(section => {
        const lines = section.split('\n');
        const title = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();
        return { title, body };
    });

    if (sections.length === 0 && !disclaimer) {
        return (
             <div 
                className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 animate-fade-in prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }}
            />
        )
    }

    return (
        <div className="animate-fade-in">
            {sections.map((section, index) => (
                <AnalysisSection 
                    key={index} 
                    title={section.title} 
                    content={section.body}
                    delay={index * 200} 
                />
            ))}
            {disclaimer && (
                <div className="mt-6 text-center text-sm text-gray-500 p-4 bg-black/20 rounded-lg animate-fade-in" style={{ animationDelay: `${sections.length * 200}ms` }}>
                   <p dangerouslySetInnerHTML={{ __html: marked.parse(disclaimer) as string }} />
                </div>
            )}
        </div>
    );
};

export default AnalysisDisplay;
