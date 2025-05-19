"use client"
import { useEffect, useRef } from "react"
import dynamic from 'next/dynamic'
import Prism from "prismjs"

import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-bash"
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import "prismjs/components/prism-solidity"
import "prismjs/components/prism-rust"

const CodeBlockClient = ({
  children,
  language,
  className = ""
}: {
  children: React.ReactNode
  language: string
  className?: string
}) => {
  const codeRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children, language]);

  return (
      <pre className={`text-foreground overflow-x-auto ${className}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {children}
        </code>
      </pre>
  );
};

const CodeBlock = dynamic(() => Promise.resolve(CodeBlockClient), { 
  ssr: false,
  loading: () => (
    <div className="bg-secondary/50 p-4 rounded-md my-4 animate-pulse">
      <pre className="text-foreground overflow-x-auto">
        <code>Loading...</code>
      </pre>
    </div>
  )
});

export default CodeBlock;
