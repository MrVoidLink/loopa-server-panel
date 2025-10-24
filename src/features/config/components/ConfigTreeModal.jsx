import React from "react";

function TreeNode({ node }) {
  if (!node) return null;

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  return (
    <li className="space-y-2">
      <div className="rounded-lg bg-[var(--bg-main)]/40 px-3 py-2 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-[var(--text-main)]">
            {node.label}
          </span>
          {node.path && (
            <span className="break-all text-xs text-[var(--text-muted)]">
              {node.path}
            </span>
          )}
          {typeof node.value === "string" && node.value.length > 0 && (
            <span className="text-xs text-[var(--text-muted)]">
              {node.value}
            </span>
          )}
        </div>
      </div>

      {hasChildren && (
        <ul className="ml-4 space-y-2 border-l border-[var(--border-color)]/50 pl-4">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${node.label}-${child.label ?? index}-${index}`}
              node={child}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function ConfigTreeModal({ record, tree, fileTrees = [], onClose }) {
  if (!record || (!tree && fileTrees.length === 0)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur py-8">
      <div className="relative mx-4 flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/95 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
        >
          Close
        </button>

        <div className="space-y-8 overflow-y-auto px-8 py-10">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold text-[var(--text-main)]">
              {record.tag}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Generated configuration structure
            </p>
          </header>

          {tree && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Record & Inbound
              </h3>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/30 p-6">
                <ul className="space-y-3">
                  <TreeNode node={tree} />
                </ul>
              </div>
            </section>
          )}

          {fileTrees.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                File Structure
              </h3>
              <div className="space-y-6">
                {fileTrees.map((fileTree, index) => (
                  <div
                    key={`${fileTree.path ?? fileTree.label}-${index}`}
                    className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/30 p-6"
                  >
                    <ul className="space-y-3">
                      <TreeNode node={fileTree} />
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfigTreeModal;
