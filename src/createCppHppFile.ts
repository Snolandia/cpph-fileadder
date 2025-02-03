import * as vscode from "vscode";
import * as fs from "fs";

export function CreateCppHppFile(context: vscode.ExtensionContext) {
  const addCppHppFile = vscode.commands.registerCommand("cpp-organizer.addCppHppFile", (contextSelection: vscode.Uri, allSelections: vscode.Uri[]) => {
    vscode.window
      .showInputBox({
        placeHolder: "Input New File Name",
      })
      .then((response: string | undefined) => {
        if (response !== undefined) {
          const wsedit = new vscode.WorkspaceEdit();

          var cppCreated = false;
          var hppCreated = false;

          var cppFile = vscode.Uri.file(contextSelection.fsPath + "\\" + response + ".cpp");

          var hppFile = vscode.Uri.file(contextSelection.fsPath + "\\" + response + ".hpp");

          if (fs.existsSync(contextSelection.fsPath + "\\" + response + ".hpp")) {
            vscode.window.showErrorMessage("File already exists: \n\r" + contextSelection.fsPath + "/" + response + ".hpp");
          } else {
            wsedit.createFile(hppFile, { ignoreIfExists: true });
            vscode.window.showInformationMessage("File created: \n\r" + contextSelection.fsPath + "/" + response + ".hpp");
            hppCreated = true;
            if (vscode.workspace.getConfiguration("cppOrganizer").get("createIncludeGuards")) {
              var removeStr: string = vscode.workspace.getWorkspaceFolder(hppFile)?.uri.path ?? "";
              removeStr = removeStr.replaceAll("/", "\\");
              removeStr += "\\";
              var relPath = "\\" + contextSelection.fsPath;

              var relPath = relPath.replace(removeStr, "");
              var def = (relPath + "\\" + response).toUpperCase();

              def = def.replaceAll("/", "_");
              def = def.replaceAll("\\", "_");

              fs.writeFileSync(
                contextSelection.fsPath + "\\" + response + ".hpp",
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
            vscode.window.showErrorMessage("File already exists: \n\r" + contextSelection.fsPath + "/" + response + ".hpp");
          } else {
            wsedit.createFile(cppFile, { ignoreIfExists: true });
            vscode.window.showInformationMessage("File created: \n\r" + contextSelection.fsPath + "/" + response + ".cpp");
            cppCreated = true;
            fs.writeFileSync(contextSelection.fsPath + "\\" + response + ".cpp", '#include "' + response + '.hpp"');
          }

          if (cppCreated || hppCreated) {
            vscode.workspace.applyEdit(wsedit);

            if (cppCreated) {
              vscode.commands.executeCommand("revealInExplorer", cppFile);
            }
            if (hppCreated) {
              vscode.commands.executeCommand("revealInExplorer", hppFile);
            }
            if (cppCreated && vscode.workspace.getConfiguration("cppOrganizer").get("openCppFileAfterCreation")) {
              vscode.window.showTextDocument(cppFile);
            }
            if (hppCreated && vscode.workspace.getConfiguration("cppOrganizer").get("openHeaderFileAfterCreation")) {
              vscode.window.showTextDocument(hppFile);
            }
          }else{
            vscode.window.showErrorMessage("File Could Not Be Created");
          }
        }
      });
  });

  context.subscriptions.push(addCppHppFile);
}
