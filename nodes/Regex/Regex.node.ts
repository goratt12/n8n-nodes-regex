import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Regex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Regex',
		name: 'regex',
		icon: 'file:Regex.svg',
		group: ['transform'],
		version: 1,
		description: 'Apply a Regex pattern (with optional flags) to text',
		defaults: {
			name: 'Regex',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Text to Match',
				name: 'text',
				type: 'string',
				default: '',
				placeholder: 'Enter text or use an expression...',
				required: true,
				description: 'The text on which to perform the regex',
			},
			{
				displayName: 'Regex Pattern',
				name: 'pattern',
				type: 'string',
				default: '',
				placeholder: '(?<myGroup>\\w+) etc.',
				required: true,
				description: 'The regex pattern to use (without / /)',
			},
			{
				displayName: 'Flags',
				name: 'flags',
				type: 'multiOptions',
				options: [
					{ name: 'Dot All (S)', value: 's' },
					{ name: 'Global (G)', value: 'g' },
					{ name: 'Ignore Case (I)', value: 'i' },
					{ name: 'Multiline (M)', value: 'm' },
					{ name: 'Sticky (Y)', value: 'y' },
					{ name: 'Unicode (U)', value: 'u' },
				],
				default: [],

				description: 'Select the regex flags you want to apply',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnItems: INodeExecutionData[] = [];

		// Define the helper as a local function (or arrow function)
		const buildMatchOutput = (execArray: RegExpExecArray): IDataObject => {
			const result: IDataObject = {};
			// Full match
			result.match = execArray[0];

			// Named groups?
			const groups = (execArray as any).groups || {};
			const namedGroupKeys = Object.keys(groups);

			if (namedGroupKeys.length > 0) {
				for (const groupName of namedGroupKeys) {
					result[groupName] = groups[groupName];
				}
			} else {
				// Non-named groups => group1, group2, ...
				for (let i = 1; i < execArray.length; i++) {
					result[`group${i}`] = execArray[i];
				}
			}

			return result;
		};

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const text = this.getNodeParameter('text', itemIndex) as string;
			const pattern = this.getNodeParameter('pattern', itemIndex) as string;
			const selectedFlags = this.getNodeParameter('flags', itemIndex) as string[];

			// Combine flags
			const flagsString = selectedFlags.join('');

			// Compile regex
			let regex: RegExp;
			try {
				regex = new RegExp(pattern, flagsString);
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid regex pattern: ${(error as Error).message}`
				);
			}

			// If 'g' is selected, repeatedly exec
			if (flagsString.includes('g')) {
				let execArray: RegExpExecArray | null;
				while ((execArray = regex.exec(text)) !== null) {
					returnItems.push({
						json: buildMatchOutput(execArray),
					});
				}
			} else {
				// Single match
				const execArray = regex.exec(text);
				if (execArray) {
					returnItems.push({
						json: buildMatchOutput(execArray),
					});
				}
			}
		}
		// If no matches, returnItems is empty
		return [returnItems];
	}
}
