import { IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint';
import { CallExpression, SourceFile } from 'typescript';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'no-getElementById',
    description:
      'Disallows `document.getElementById`.',
    optionsDescription: 'Not configurable.',
    options: null,
    type: 'functionality',
    typescriptOnly: true,
  };

  public static FAILURE_STRING = 'Calls to document.getElementById';
  public static MATCH_REGEX = /^(document.getElementById)\.only)/;

  public apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NoGetElementByIdWalker(sourceFile, this.getOptions()),
    );
  }
}

// tslint:disable max-classes-per-file
class NoGetElementByIdWalker extends RuleWalker {
  public visitCallExpression(node: CallExpression) {
    const match = node.getText().match(Rule.MATCH_REGEX);

    if (match && match[0]) {
      this.addFailureAt(node.getStart(), match[0].length, Rule.FAILURE_STRING);
    }

    super.visitCallExpression(node);
  }
}
