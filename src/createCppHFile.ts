import * as vscode from "vscode";
import * as fs from "fs";

export function CreateCppHFile(context: vscode.ExtensionContext) {
  const addCppHFile = vscode.commands.registerCommand("cpp-organizer.addCppHFile", (contextSelection: vscode.Uri, allSelections: vscode.Uri[]) => {
    vscode.window
      .showInputBox({
        placeHolder: "Input New File Name",
      })
      .then((response: string | undefined) => {
        if (response !== undefined) {
          const wsedit = new vscode.WorkspaceEdit();

          var cppCreated = false;
          var hCreated = false;

          var cppFile = vscode.Uri.file(contextSelection.fsPath + "\\" + response + ".cpp");

          var hFile = vscode.Uri.file(contextSelection.fsPath + "\\" + response + ".h");

          if (fs.existsSync(contextSelection.fsPath + "\\" + response + ".h")) {
            vscode.window.showErrorMessage("File already exists: \n\r" + contextSelection.fsPath + "/" + response + ".h");
          } else {
            wsedit.createFile(hFile, { ignoreIfExists: true });
            vscode.window.showInformationMessage("File created: \n\r" + contextSelection.fsPath + "/" + response + ".h");
            hCreated = true;
            if (vscode.workspace.getConfiguration("cppOrganizer").get("createIncludeGuards")) {
              var removeStr: string = vscode.workspace.getWorkspaceFolder(hFile)?.uri.path ?? "";
              removeStr = removeStr.replaceAll("/", "\\");
              removeStr += "\\";
              var relPath = "\\" + contextSelection.fsPath;

              var relPath = relPath.replace(removeStr, "");
              var def = (relPath + "\\" + response).toUpperCase();

              def = def.replaceAll("/", "_");
              def = def.replaceAll("\\", "_");

              fs.writeFileSync(
                contextSelection.fsPath + "\\" + response + ".h",
                "#ifndef " +
                  def +
                  "\n" +
                  "#define " +
                  def +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "#endif   //" +
                  def +
                  "\n"
              );
            } else {
              vscode.window.showInformationMessage("bad guard");
            }
          }

          if (fs.existsSync(contextSelection.fsPath + "\\" + response + ".cpp")) {
            vscode.window.showErrorMessage("File already exists: \n\r" + contextSelection.fsPath + "/" + response + ".h");
          } else {
            wsedit.createFile(cppFile, { ignoreIfExists: true });
            vscode.window.showInformationMessage("File created: \n\r" + contextSelection.fsPath + "/" + response + ".cpp");
            cppCreated = true;
            fs.writeFileSync(contextSelection.fsPath + "\\" + response + ".cpp", '#include "' + response + '.h"');
          }

          if (cppCreated || hCreated) {
            vscode.workspace.applyEdit(wsedit);

            if (cppCreated) {
              vscode.commands.executeCommand("revealInExplorer", cppFile);
            }
            if (hCreated) {
              vscode.commands.executeCommand("revealInExplorer", hFile);
            }
            if (cppCreated && vscode.workspace.getConfiguration("cppOrganizer").get("openCppFileAfterCreation")) {
              vscode.window.showTextDocument(cppFile);
            }
            if (hCreated && vscode.workspace.getConfiguration("cppOrganizer").get("openHeaderFileAfterCreation")) {
              vscode.window.showTextDocument(hFile);
            }
          }else{
            vscode.window.showErrorMessage("File Could Not Be Created");
          }
        }
      });
  });

  context.subscriptions.push(addCppHFile);
}
