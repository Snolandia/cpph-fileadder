import * as vscode from "vscode";
import * as fs from "fs";

export function CreateCHFile(context: vscode.ExtensionContext) {
  const addCHFile = vscode.commands.registerCommand("cpp-organizer.addCHFile", (contextSelection: vscode.Uri, allSelections: vscode.Uri[]) => {
    vscode.window
      .showInputBox({
        placeHolder: "Input New File Name",
      })
      .then((response: string | undefined) => {
        if (response !== undefined) {
          const wsedit = new vscode.WorkspaceEdit();

          var cCreated = false;
          var hCreated = false;

          var cFile = vscode.Uri.file(contextSelection.fsPath + "\\" + response + ".c");

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

          if (fs.existsSync(contextSelection.fsPath + "\\" + response + ".c")) {
            vscode.window.showErrorMessage("File already exists: \n\r" + contextSelection.fsPath + "/" + response + ".h");
          } else {
            wsedit.createFile(cFile, { ignoreIfExists: true });
            vscode.window.showInformationMessage("File created: \n\r" + contextSelection.fsPath + "/" + response + ".c");
            cCreated = true;
            fs.writeFileSync(contextSelection.fsPath + "\\" + response + ".c", '#include "' + response + '.h"');
          }

          if (cCreated || hCreated) {
            vscode.workspace.applyEdit(wsedit);

            if (cCreated) {
              vscode.commands.executeCommand("revealInExplorer", cFile);
            }
            if (hCreated) {
              vscode.commands.executeCommand("revealInExplorer", hFile);
            }
            if (cCreated && vscode.workspace.getConfiguration("cppOrganizer").get("openCppFileAfterCreation")) {
              vscode.window.showTextDocument(cFile);
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

  context.subscriptions.push(addCHFile);
}
