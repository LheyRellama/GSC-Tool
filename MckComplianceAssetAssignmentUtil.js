/**
 * Script Include: MckComplianceAssetAssignmentUtil
 * Scope: GSC tool (Compliance Asset Update — GSC path). ITDC out of scope unless reused by policy.
 * Client callable: true
 * Accessible from: All application scopes (adjust per governance)
 *
 * PURPOSE:
 *   Exposes system property values to catalog client scripts (browser cannot call gs.getProperty).
 *   Single source of truth for SIM permanent assignment business values (HCR).
 *
 * SYSTEM PROPERTIES — create in System Properties [sys_properties]:
 *
 *   mck.asset_assign.sim_permanent_loan_days
 *     Suggested value: 180
 *     Description: Calendar days added to the assignment date for loan end date when model
 *                  category is SIM-type and assignment type is Permanent (Compliance Asset Update).
 *
 *   mck.asset_assign.sim_model_category_sys_id_list
 *     Suggested value: (instance-specific — sys_ids from cmdb_model_category for SIM, SIM Profile, etc.)
 *     Description: Comma-separated sys_ids for alm_hardware.model_category reference values that count
 *                  as SIM family. Compared to the field value (reference sys_id) on the client and server.
 *
 *   mck.asset_assign.assignment_type_permanent_display
 *     Suggested value: Permanent
 *     Description: Display (or stored value) for the Permanent choice on catalog variable
 *                  new_assignment_type; used to detect Permanent in client script.
 *
 * Server-side category lookup (getModelCategorySysIdForAsset) tries VA then hardware tables — edit
 * the defaultAssetLookupTables string inside _resolveModelCategoryFromAssetSysId if your VA table differs.
 */

var MckComplianceAssetAssignmentUtil = Class.create();
MckComplianceAssetAssignmentUtil.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    /**
     * Server-side model category resolution (client getReference can return empty due to ACL/scope).
     * Client calls with sysparm_name=getModelCategorySysIdForAsset, sysparm_asset_sys_id=<sys_id>.
     * Returns JSON: { "modelCategorySysId": "<32-char sys_id or empty>" }
     */
    getModelCategorySysIdForAsset: function() {
        var assetSysId = this.getParameter('sysparm_asset_sys_id');
        var cat = this._resolveModelCategoryFromAssetSysId(assetSysId);
        return JSON.stringify({ modelCategorySysId: cat || '' });
    },

    _resolveModelCategoryFromAssetSysId: function(assetSysId) {
        if (!assetSysId) {
            return '';
        }
        var defaultAssetLookupTables = 'x_mkmig_vap_virtual_asset,alm_hardware';
        var tables = defaultAssetLookupTables.split(',');
        var i;
        for (i = 0; i < tables.length; i++) {
            var tableName = (tables[i] + '').replace(/^\s+|\s+$/g, '');
            if (!tableName) {
                continue;
            }
            var gr;
            try {
                gr = new GlideRecord(tableName);
            } catch (e1) {
                continue;
            }
            if (!gr.get(assetSysId)) {
                continue;
            }
            var c = gr.getValue('model_category') || gr.getValue('u_model_category')
                || gr.getValue('cmdb_model_category') || gr.getValue('u_cmdb_model_category');
            if (c) {
                return c;
            }
            var modelId = gr.getValue('model');
            if (modelId) {
                var gm = new GlideRecord('cmdb_model');
                if (gm.get(modelId)) {
                    var mc = gm.getValue('cmdb_model_category');
                    if (mc) {
                        return mc;
                    }
                }
            }
        }
        return '';
    },

    /**
     * Returns JSON string for client: loanDays, modelCategorySysIdList, permanentAssignmentDisplay
     */
    getSimPermanentConfig: function() {
        var loanDaysPropertyName = 'mck.asset_assign.sim_permanent_loan_days';
        var categoryListPropertyName = 'mck.asset_assign.sim_model_category_sys_id_list';
        var permanentDisplayPropertyName = 'mck.asset_assign.assignment_type_permanent_display';

        var defaultLoanDays = '180';
        var defaultCategorySysIdList = '';
        var defaultPermanentDisplay = 'Permanent';

        var loanDays = gs.getProperty(loanDaysPropertyName, defaultLoanDays);
        var modelCategorySysIdList = gs.getProperty(categoryListPropertyName, defaultCategorySysIdList);
        var permanentAssignmentDisplay = gs.getProperty(permanentDisplayPropertyName, defaultPermanentDisplay);

        var payload = {
            loanDays: loanDays,
            modelCategorySysIdList: modelCategorySysIdList,
            permanentAssignmentDisplay: permanentAssignmentDisplay
        };

        return JSON.stringify(payload);
    },

    type: 'MckComplianceAssetAssignmentUtil'
});
