import GeneratedContent from '../models/GeneratedContent.js';
import Context from '../models/Context.js';
import User from '../models/User.js';
import AnswerStyle from '../models/AnswerStyle.js';
import Subject from '../models/Subject.js';
import * as aiOrchestrator from '../services/aiOrchestrator.js';

const buildContextData = (contexts) => ({
  syllabus: contexts.find((c) => c.type === 'syllabus')?.content || '',
  notes: contexts
    .filter((c) => c.type === 'notes')
    .map((c) => c.content)
    .join('\n\n'),
  pyq: contexts.find((c) => c.type === 'pyq')?.content || ''
});

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const handleControllerError = (res, error) => {
  res.status(error.statusCode || 500).json({ message: error.message });
};

const getUserSubjectAndStyle = async (userId, subjectId) => {
  const user = await User.findById(userId);
  const subject = await Subject.findOne({ _id: subjectId, userId });
  if (!subject) {
    throw createError('Subject not found', 404);
  }
  const styleProfile = await AnswerStyle.findById(user.activeStyleProfileId);
  if (!styleProfile) {
    throw createError('No active style profile found', 400);
  }
  return { user, subject, styleProfile };
};

export const getContentsBySubject = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { userId: req.userId, subjectId: req.params.subjectId };
    if (type) query.type = type;

    const contents = await GeneratedContent.find(query).sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await GeneratedContent.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const generateNotesContent = async (req, res) => {
  try {
    const { subjectId, topic, depth } = req.body;
    const { user, subject, styleProfile } = await getUserSubjectAndStyle(
      req.userId,
      subjectId
    );
    const contexts = await Context.find({ userId: req.userId, subjectId });
    const contextData = buildContextData(contexts);

    const userContext = {
      university: user.university,
      branch: user.branch,
      semester: user.semester,
      subject: subject.name
    };

    const generatedContent = await aiOrchestrator.generateNotes(
      userContext,
      styleProfile,
      contextData,
      topic,
      depth || 'medium'
    );

    const content = new GeneratedContent({
      userId: req.userId,
      subjectId,
      type: 'notes',
      title: `Study Notes: ${topic}`,
      topic,
      content: generatedContent,
      styleProfileId: styleProfile._id,
      contextUsed: contexts.map((c) => c._id),
      metadata: {
        depth: depth || 'medium',
        generatedAt: new Date()
      }
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const generateReportContent = async (req, res) => {
  try {
    const { subjectId, topic, wordCount, requiredSections } = req.body;
    const { user, subject, styleProfile } = await getUserSubjectAndStyle(
      req.userId,
      subjectId
    );
    const contexts = await Context.find({ userId: req.userId, subjectId });
    const contextData = buildContextData(contexts);

    const userContext = {
      university: user.university,
      branch: user.branch,
      semester: user.semester,
      subject: subject.name
    };

    const generatedContent = await aiOrchestrator.generateReport(
      userContext,
      styleProfile,
      contextData,
      topic,
      wordCount || 1000,
      requiredSections || [
        'Abstract',
        'Introduction',
        'Methodology',
        'Analysis',
        'Conclusion',
        'References'
      ]
    );

    const content = new GeneratedContent({
      userId: req.userId,
      subjectId,
      type: 'report',
      title: `Report: ${topic}`,
      topic,
      content: generatedContent,
      styleProfileId: styleProfile._id,
      contextUsed: contexts.map((c) => c._id),
      metadata: {
        wordCount: wordCount || 1000,
        generatedAt: new Date()
      }
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const generatePPTContent = async (req, res) => {
  try {
    const { subjectId, topic, slideCount, presentationType } = req.body;
    const { user, subject, styleProfile } = await getUserSubjectAndStyle(
      req.userId,
      subjectId
    );
    const contexts = await Context.find({ userId: req.userId, subjectId });
    const contextData = buildContextData(contexts);

    const userContext = {
      university: user.university,
      branch: user.branch,
      semester: user.semester,
      subject: subject.name
    };

    const generatedContent = await aiOrchestrator.generatePPT(
      userContext,
      styleProfile,
      contextData,
      topic,
      slideCount || 10,
      presentationType || 'seminar'
    );

    const content = new GeneratedContent({
      userId: req.userId,
      subjectId,
      type: 'ppt',
      title: `PPT: ${topic}`,
      topic,
      content: generatedContent,
      styleProfileId: styleProfile._id,
      contextUsed: contexts.map((c) => c._id),
      metadata: {
        slideCount: slideCount || 10,
        generatedAt: new Date()
      }
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateContent = async (req, res) => {
  try {
    const content = await GeneratedContent.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    Object.assign(content, req.body);
    await content.save();
    res.json(content);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await GeneratedContent.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await GeneratedContent.deleteOne({ _id: req.params.id });
    res.json({ message: 'Content deleted' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

